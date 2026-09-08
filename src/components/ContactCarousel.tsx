"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { AppUser } from "@/services/users";
import { BackIcon } from "./Icons";

type ContactCarouselProps = {
  contacts: AppUser[];
  onSelect: (contact: AppUser) => void;
};

export function ContactCarousel({ contacts, onSelect }: ContactCarouselProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
  });

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    function onWheel(event: WheelEvent) {
      if (!scroller) {
        return;
      }

      if (event.deltaY === 0 && event.deltaX === 0) {
        return;
      }

      event.preventDefault();
      scroller.scrollLeft += event.deltaY + event.deltaX;
    }

    scroller.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      scroller.removeEventListener("wheel", onWheel);
    };
  }, []);

  function scrollByPage(direction: -1 | 1) {
    scrollerRef.current?.scrollBy({
      left: direction * 220,
      behavior: "smooth",
    });
  }

  function onPointerDown(event: React.PointerEvent<HTMLUListElement>) {
    const scroller = scrollerRef.current;

    if (!scroller || event.pointerType === "touch") {
      return;
    }

    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScroll: scroller.scrollLeft,
    };
    scroller.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLUListElement>) {
    const scroller = scrollerRef.current;
    const drag = dragRef.current;

    if (!scroller || !drag.active) {
      return;
    }

    const delta = event.clientX - drag.startX;

    if (Math.abs(delta) > 4) {
      drag.moved = true;
    }

    scroller.scrollLeft = drag.startScroll - delta;
  }

  function endDrag() {
    dragRef.current.active = false;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        className="absolute top-4 -left-2 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm md:flex"
        aria-label="Previous contacts"
      >
        <BackIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        className="absolute top-4 -right-2 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm md:flex"
        aria-label="Next contacts"
      >
        <BackIcon className="h-4 w-4 rotate-180" />
      </button>

      <ul
        ref={scrollerRef}
        aria-label="Frequent contacts"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(event) => {
          if (dragRef.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            dragRef.current.moved = false;
          }
        }}
        className="flex cursor-grab gap-5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] active:cursor-grabbing md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {contacts.map((contact) => (
          <li key={contact.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onSelect(contact)}
              className="flex w-16 flex-col items-center gap-2"
            >
              <Image
                src={contact.avatar}
                alt={contact.fullName}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
                draggable={false}
              />
              <span className="w-full truncate text-center text-xs text-zinc-700">
                {contact.firstName}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
