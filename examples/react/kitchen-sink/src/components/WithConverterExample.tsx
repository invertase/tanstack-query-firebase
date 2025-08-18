import { useCollectionQuery } from "@tanstack-query-firebase/react/firestore";
import {
  collection,
  type DocumentData,
  getFirestore,
  type QueryDocumentSnapshot,
  query,
  type SnapshotOptions,
} from "firebase/firestore";

type Product = {
  name: string;
  price: number;
};

const productConverter = {
  toFirestore(product: Product): DocumentData {
    return product;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Product {
    const data = snapshot.data(options);
    return {
      name: data.name,
      price: data.price,
    };
  },
};

export function WithConverterExample() {
  const firestore = getFirestore();
  const ref = query(
    collection(firestore, "products").withConverter(productConverter),
  );

  const { data, isLoading, isError, error } = useCollectionQuery(ref, {
    queryKey: ["products"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  const products = data?.docs.map((doc) => doc.data()) ?? [];

  return (
    <div className="App">
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.name}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
