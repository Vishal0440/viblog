import React from "react";
import { PenLine, BookOpen, Share2 } from "lucide-react";

const features = [
  {
    icon: PenLine,
    title: "Write Freely",
    description:
      "Turn your ideas into beautiful articles and share your stories with the world.",
  },
  {
    icon: BookOpen,
    title: "Discover Ideas",
    description:
      "Explore interesting stories, learn something new, and find perspectives that inspire you.",
  },
  {
    icon: Share2,
    title: "Share Stories",
    description:
      "Share your favorite articles with friends and let great ideas travel further.",
  },
];

export default function WhyViBlog() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
            Why Vi Blog?
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            A place for ideas worth sharing
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
            Write what you know, discover new perspectives, and share stories
            that matter to you.
          </p>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
