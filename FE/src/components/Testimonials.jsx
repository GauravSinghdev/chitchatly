import React from "react";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 bg-white text-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard name="Alice" text="This chat app is incredible, easy to use!" />
          <TestimonialCard name="Bob" text="The best chat app I’ve ever used!" />
          <TestimonialCard name="Charlie" text="I can stay connected with all my friends!" />
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ name, text }) => (
  <div className="bg-gray-100 rounded-lg shadow p-6 text-center">
    <p className="italic mb-4">"{text}"</p>
    <p className="font-semibold">- {name}</p>
  </div>
);

export default Testimonials;
