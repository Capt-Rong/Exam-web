import { PricingTable } from "@clerk/nextjs";
import React from "react";

const Subscription = () => {
  return (
    <main className="flex justify-center items-center h-screen bg-white">
      <PricingTable />
    </main>
  );
};

export default Subscription;
