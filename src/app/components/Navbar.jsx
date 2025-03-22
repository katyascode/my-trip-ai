'use client';
import React from 'react';
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="relative bg-white-100 border-b border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl text-pink-800 font-semibold">MyTrip AI</Link>
        <div className="flex items-center gap-6">
          <Link
            className="text-lg text-pink-600"
            href="/trips/create"
          >
            Create
          </Link>
          <Link
            className="text-lg text-pink-600"
            href="/trips"
          >
            Trips
          </Link>
          <Link
             className="text-lg text-pink-600"
             href="/trips/profile"
          >
             Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
