import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import supabase from "@/Config/SupabaseClient";

export default function Banner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const channel = supabase.channel("salon-status");
    channel.on("broadcast", { event: "status-change" }, (payload) => {
      setIsOpen(payload.payload.is_open); // Update the status based on the event payload
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div
      className={`relative isolate flex items-center gap-x-6 overflow-hidden px-6 py-3 sm:px-3.5 sm:before:flex-1 ${
        isOpen ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-white">
          <strong className="font-semibold text-lg">
            {isOpen ? "We're Open Today" : "We're Closed Today"}
          </strong>
        </p>
      </div>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon aria-hidden="true" className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}
