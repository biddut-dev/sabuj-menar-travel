"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  number?: string;
}

export default function WhatsAppButton({ number }: WhatsAppButtonProps) {
  const cleanNumber = (number || "+8801711123456").replace(/\+/g, '').replace(/\s/g, '');
  const message = encodeURIComponent("Assalamu Alaikum. I am interested in Hajj/Umrah packages from Sabuj Menar Travel Agency. Please contact me.");
  const url = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-45 bg-[#25D366] hover:bg-[#20BA5A] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-115 flex items-center justify-center group hover:shadow-[0_0_20px_rgba(37,211,102,0.6)]"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      {/* SVG layout for WhatsApp icon matching branding */}
      <svg
        viewBox="0 0 24 24"
        className="w-6.5 h-6.5 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.452 4.905 1.453 5.393 0 9.778-4.381 9.782-9.77.002-2.611-1.015-5.064-2.865-6.918C16.62 2.062 14.162.82 11.554.82 6.165.82 1.782 5.201 1.778 10.59c-.001 1.769.467 3.493 1.357 5.02L2.125 21.98l6.522-1.712zM17.15 14.47c-.29-.145-1.717-.847-1.982-.943-.266-.096-.46-.144-.653.146-.193.29-.747.943-.916 1.135-.168.192-.337.216-.627.072-2.9-.145-4.83-1.085-6.73-2.733-.29-.25-.32-.236.03-.64.24-.275.53-.64.63-.865.097-.225.048-.42-.024-.564-.072-.143-.653-1.572-.894-2.15-.236-.566-.475-.487-.653-.496-.168-.008-.362-.01-.555-.01-.193 0-.507.072-.772.36-.265.288-1.013.99-1.013 2.415 0 1.425 1.037 2.803 1.18 2.996.145.193 2.04 3.115 4.94 4.368.69.298 1.23.476 1.65.61.693.22 1.325.19 1.824.115.556-.083 1.716-.701 1.958-1.378.24-.677.24-1.258.17-1.378-.073-.12-.266-.192-.556-.338z" />
      </svg>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-bold text-xs pl-0 group-hover:pl-2.5 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}
