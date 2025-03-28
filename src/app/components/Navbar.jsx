'use client';
import React from 'react';
import Link from "next/link";
import {FaBookAtlas, FaSuitcase} from "react-icons/fa6";
import {FaFileUpload, FaUser} from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="relative bg-white-100 border-b border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl text-pink-800 font-semibold">MyTrip AI</Link>
        <div className="flex items-center gap-6 mt-2">
          <Link
            className="text-lg text-pink-600 flex flex-col gap-1 items-center justify-center"
            href="/trips/create"
          >
            <FaSuitcase size={25}/>
            <p className="text-xs">Create</p>
          </Link>
          <Link
            className="text-lg text-pink-600 flex flex-col gap-1 items-center justify-center"
            href="/trips"
          >
            <FaBookAtlas size={25}/>
            <p className="text-xs">Trips</p>
          </Link>
          <Link
            className="text-lg text-pink-600 flex flex-col gap-1 items-center justify-center"
             href="/trips/upload"
             >
            <FaFileUpload size={25}/>
            <p className="text-xs">Upload</p>
          </Link>
          <Link
            className="text-lg text-pink-600 flex flex-col gap-1 items-center justify-center"
            href="/trips/profile"
          >
            <FaUser size={25}/>
            <p className="text-xs">Profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
