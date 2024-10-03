'use client';

import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'; // Use the filled heart from heroicons
import { useState } from 'react';

export default function LikeButton() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={() => setIsPressed(!isPressed)}
      aria-label="Like"
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-500 ${isPressed ? 'scale-110' : 'scale-100'}`} // Animates the button scaling
    >
      {isPressed ? (
        <HeartSolidIcon className="duration-600 h-7 w-7 text-red-500 transition-colors" />
      ) : (
        <HeartOutlineIcon className="duration-600 h-7 w-7 stroke-1 text-gray-400 transition-all" />
      )}
    </button>
  );
}
