import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useAddDocumentMutation,
  useCollectionQuery,
} from "@tanstack-query-firebase/react/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  topic: string;
  description: string;
  members: string[];
  isConcluded: boolean;
  createdAt: Date;
  lastMessageAt: Date;
  chatMessages?: ChatMessage[];
}

export function NestedCollectionsExample() {
  const [newConversationTopic, setNewConversationTopic] = useState("");
  const [newConversationDescription, setNewConversationDescription] =
    useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [filterConcluded, setFilterConcluded] = useState<boolean | null>(null);

  const queryClient = useQueryClient();
  const firestore = getFirestore();
  const conversationsCollection = collection(firestore, "conversations");

  // Query conversations with real-time updates
  const conversationsQuery =
    filterConcluded !== null
      ? query(
          conversationsCollection,
          where("isConcluded", "==", filterConcluded),
          orderBy("lastMessageAt", "desc"),
        )
      : query(conversationsCollection, orderBy("lastMessageAt", "desc"));

  const {
    data: conversationsSnapshot,
    isLoading: conversationsLoading,
    isError: conversationsError,
    error: conversationsErrorData,
  } = useCollectionQuery(conversationsQuery, {
    queryKey: ["conversations", filterConcluded],
    subscribed: true, // Enable real-time updates
  });

  // Query chat messages for selected conversation with real-time updates
  const chatMessagesQuery = selectedConversationId
    ? query(
        collection(
          firestore,
          "conversations",
          selectedConversationId,
          "chatMessages",
        ),
        orderBy("timestamp", "asc"),
        limit(50),
      )
    : null;

  const {
    data: messagesSnapshot,
    isLoading: messagesLoading,
    isError: messagesError,
    error: messagesErrorData,
  } = useCollectionQuery(chatMessagesQuery!, {
    queryKey: ["chatMessages", selectedConversationId],
    enabled: !!selectedConversationId && !!chatMessagesQuery,
    subscribed: true, // Enable real-time updates
  });

  // Mutations
  const addConversationMutation = useAddDocumentMutation(
    conversationsCollection,
    {
      onSuccess: () => {
        // Invalidate conversations query to refresh the list
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
      onError: (error) => {
        console.error("Failed to add conversation:", error);
        // Could show a toast notification here
      },
    },
  );

  // Custom mutation for adding messages with proper invalidation
  const addMessageMutation = useMutation({
    mutationFn: async (newMessage: Omit<ChatMessage, "id">) => {
      if (!selectedConversationId) {
        throw new Error("No conversation selected");
      }
      const messagesCollection = collection(
        firestore,
        "conversations",
        selectedConversationId,
        "chatMessages",
      );
      return addDoc(messagesCollection, newMessage);
    },
    onMutate: async (newMessage) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: ["chatMessages", selectedConversationId],
      });

      // Store the actual snapshot structure
      const previousSnapshot = queryClient.getQueryData([
        "chatMessages",
        selectedConversationId,
      ]);

      // Create a temporary message with proper structure
      const tempMessage = {
        id: `temp-${Date.now()}`,
        ...newMessage,
        timestamp: new Date(),
      };

      // Update maintaining the snapshot structure
      queryClient.setQueryData(
        ["chatMessages", selectedConversationId],
        (old: any) => {
          if (!old) return old;

          // Create a new doc-like object
          const newDoc = {
            id: tempMessage.id,
            data: () => tempMessage,
            // Include other doc methods if needed
          };

          return {
            ...old,
            docs: [...(old.docs || []), newDoc],
          };
        },
      );

      return { previousSnapshot };
    },
    onError: (error, _variables, context) => {
      // Show user-friendly error message
      console.error("Failed to send message:", error);
      // Could show a toast notification here

      // Rollback optimistic update
      if (context?.previousSnapshot) {
        queryClient.setQueryData(
          ["chatMessages", selectedConversationId],
          context.previousSnapshot,
        );
      }
    },
    onSuccess: async () => {
      // Update conversation's lastMessageAt
      if (selectedConversationId) {
        try {
          await updateDoc(
            doc(firestore, "conversations", selectedConversationId),
            {
              lastMessageAt: new Date(),
            },
          );
        } catch (error) {
          console.error("Failed to update conversation timestamp:", error);
        }
      }

      // Invalidate both queries
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", selectedConversationId],
      });
    },
  });

  // Custom mutation for deleting conversations
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const conversationRef = doc(firestore, "conversations", conversationId);
      return deleteDoc(conversationRef);
    },
    onError: (error, _conversationId) => {
      console.error("Failed to delete conversation:", error);
      // Could show a toast notification here
    },
    onSuccess: (_, conversationId) => {
      // Invalidate conversations query
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // Clear messages if this was the selected conversation
      if (selectedConversationId === conversationId) {
        queryClient.removeQueries({
          queryKey: ["chatMessages", conversationId],
        });
        setSelectedConversationId(null);
      }
    },
  });

  const handleAddConversation = async () => {
    if (!newConversationTopic.trim()) return;

    const newConversation = {
      topic: newConversationTopic.trim(),
      description: newConversationDescription.trim(),
      members: ["user1", "user2"], // In real app, this would be actual user IDs
      isConcluded: false,
      createdAt: new Date(),
      lastMessageAt: new Date(),
    };

    try {
      await addConversationMutation.mutateAsync(newConversation);
      setNewConversationTopic("");
      setNewConversationDescription("");
    } catch (error) {
      console.error("Failed to add conversation:", error);
    }
  };

  const handleAddMessage = async () => {
    if (!selectedConversationId || !newMessageText.trim()) return;

    const newMessage = {
      text: newMessageText.trim(),
      senderId: "user1", // In real app, this would be the current user's ID
      senderName: "Current User",
      timestamp: new Date(),
    };

    try {
      await addMessageMutation.mutateAsync(newMessage);
      setNewMessageText("");
    } catch (error) {
      console.error("Failed to add message:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversationMutation.mutateAsync(conversationId);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  // Proper date serialization
  const conversations =
    (conversationsSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to Dates
      createdAt:
        doc.data().createdAt?.toDate?.() || doc.data().createdAt || new Date(),
      lastMessageAt:
        doc.data().lastMessageAt?.toDate?.() ||
        doc.data().lastMessageAt ||
        new Date(),
    })) as Conversation[]) || [];

  const messages =
    (messagesSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to Dates
      timestamp:
        doc.data().timestamp?.toDate?.() || doc.data().timestamp || new Date(),
    })) as ChatMessage[]) || [];

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId,
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Nested Collections: Conversations & Chat Messages
      </h2>

      {/* Add Conversation Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Conversation</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label
              htmlFor="conversation-topic"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Topic
            </label>
            <input
              id="conversation-topic"
              type="text"
              value={newConversationTopic}
              onChange={(e) => setNewConversationTopic(e.target.value)}
              placeholder="Enter conversation topic..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddConversation()}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="conversation-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              id="conversation-description"
              type="text"
              value={newConversationDescription}
              onChange={(e) => setNewConversationDescription(e.target.value)}
              placeholder="Enter description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddConversation}
            disabled={addConversationMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {addConversationMutation.isPending
              ? "Adding..."
              : "Add Conversation"}
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex gap-4 items-center">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        <button
          onClick={() => setFilterConcluded(null)}
          className={`px-3 py-1 rounded-md text-sm ${
            filterConcluded === null
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterConcluded(false)}
          className={`px-3 py-1 rounded-md text-sm ${
            filterConcluded === false
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterConcluded(true)}
          className={`px-3 py-1 rounded-md text-sm ${
            filterConcluded === true
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Concluded
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations List */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Conversations</h3>

          {conversationsLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading conversations...</p>
            </div>
          )}

          {conversationsError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">
                Error loading conversations
              </h3>
              <p className="text-red-600 text-sm mt-1">
                {conversationsErrorData?.message || "An unknown error occurred"}
              </p>
            </div>
          )}

          {!conversationsLoading && !conversationsError && (
            <div className="space-y-3">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No conversations found. Add your first conversation above!
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`w-full text-left p-4 border rounded-lg transition-colors ${
                      selectedConversationId === conversation.id
                        ? "bg-blue-50 border-blue-300"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedConversationId(conversation.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {conversation.topic}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {conversation.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {conversation.lastMessageAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            conversation.isConcluded
                              ? "bg-gray-100 text-gray-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {conversation.isConcluded ? "Concluded" : "Active"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conversation.id);
                          }}
                          disabled={deleteConversationMutation.isPending}
                          className="text-red-600 hover:bg-red-50 rounded-md p-1 disabled:opacity-50"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">
            {selectedConversation
              ? `Chat: ${selectedConversation.topic}`
              : "Select a conversation"}
          </h3>

          {selectedConversationId ? (
            <>
              {messagesLoading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading messages...</p>
                </div>
              )}

              {messagesError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h3 className="text-red-800 font-medium">
                    Error loading messages
                  </h3>
                  <p className="text-red-600 text-sm mt-1">
                    {messagesErrorData?.message || "An unknown error occurred"}
                  </p>
                </div>
              )}

              {!messagesLoading && !messagesError && (
                <>
                  {/* Messages List */}
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className="p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-gray-700">
                              {message.senderName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-900">{message.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Message Form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddMessage()
                      }
                    />
                    <button
                      onClick={handleAddMessage}
                      disabled={
                        !newMessageText.trim() || addMessageMutation.isPending
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {addMessageMutation.isPending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>

      {/* Query Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Query Information</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Conversations Query Key:</strong>{" "}
            {JSON.stringify(["conversations", filterConcluded])}
          </p>
          <p>
            <strong>Messages Query Key:</strong>{" "}
            {selectedConversationId
              ? JSON.stringify(["chatMessages", selectedConversationId])
              : "Not selected"}
          </p>
          <p>
            <strong>Total Conversations:</strong> {conversations.length}
          </p>
          <p>
            <strong>Total Messages:</strong> {messages.length}
          </p>
          <p>
            <strong>Filter:</strong>{" "}
            {filterConcluded === null
              ? "All"
              : filterConcluded
                ? "Concluded"
                : "Active"}
          </p>
          <p>
            <strong>Real-time Updates:</strong> Enabled for both queries
          </p>
          <p>
            <strong>Optimistic Updates:</strong> Enabled for message additions
          </p>
          <p>
            <strong>Query Invalidation:</strong> Automatic after mutations
          </p>
          <p>
            <strong>Error Handling:</strong> Rollback on mutation failures
          </p>
        </div>
      </div>
    </div>
  );
}
