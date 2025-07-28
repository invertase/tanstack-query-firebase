import { act, renderHook, waitFor } from "@testing-library/react";
import {
  disableNetwork,
  doc,
  getDocFromServer,
  setDoc,
} from "firebase/firestore";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { firestore, wipeFirestore } from "~/testing-utils";
import { queryClient, wrapper } from "../../utils";
import { useEnableNetworkMutation } from "./useEnableNetworkMutation";

describe("useEnableNetworkMutation", () => {
  beforeEach(async () => {
    queryClient.clear();
    await disableNetwork(firestore);
    await wipeFirestore();
  });

  test("should successfully enable the Firestore network", async () => {
    const docRef = doc(firestore, "tests", "useEnableNetworkMutation");
    const mockData = { library: "tanstack-query-firebase" };

    const { result } = renderHook(() => useEnableNetworkMutation(firestore), {
      wrapper,
    });

    // Enable the network
    await act(() => result.current.mutate());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await setDoc(docRef, mockData);

    const fetchedDoc = await getDocFromServer(docRef);

    expect(fetchedDoc.exists()).toBe(true);
    expect(fetchedDoc.data()).toEqual(mockData);
  });

  test("handles mutation options correctly", async () => {
    const onSuccessMock = vi.fn();
    const onErrorMock = vi.fn();

    const { result } = renderHook(
      () =>
        useEnableNetworkMutation(firestore, {
          onSuccess: onSuccessMock,
          onError: onErrorMock,
        }),
      { wrapper },
    );

    await act(() => result.current.mutate());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
    });
  });
});
