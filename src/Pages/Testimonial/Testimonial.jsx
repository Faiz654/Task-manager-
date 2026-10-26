 import { FiStar, FiArrowUpRight } from "react-icons/fi";

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "University Student",
    initials: "SA",
    color: "bg-[#eee5d6] text-[#92754b]",
    review:
      "Task Manager helps me organize my assignments and keep track of deadlines. Planning my study schedule feels much easier now.",
  },
  {
    name: "Ali Hassan",
    role: "Web Developer",
    initials: "AH",
    color: "bg-[#e2e9e5] text-[#527565]",
    review:
      "I like having all my daily tasks in one place. It helps me stay focused on important work and keep my day organized.",
  },
  {
    name: "Emma Wilson",
    role: "Freelancer",
    initials: "EW",
    color: "bg-[#e8e3ef] text-[#79648f]",
    review:
      "Managing multiple tasks can be challenging, but having a clear task list makes it easier to plan my workload and track progress.",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="bg-[#faf9f6] px-6 py-20 sm:px-10 lg:px-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-[#e8e2d7] bg-white px-4 py-2 text-sm font-medium text-[#92754b]">
            User Experiences
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-[#202020] sm:text-4xl lg:text-5xl">
            What People
            <span className="text-[#a88957]"> Say</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            Discover how better organization can make everyday work
            feel simpler, clearer, and more manageable.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="group flex h-full flex-col rounded-2xl border border-[#eae6de] bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#c9b38c] hover:shadow-xl hover:shadow-[#202020]/5"
            >
              {/* Stars */}
              <div className="mb-6 flex gap-1 text-[#b18b4d]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar key={star} size={16} />
                ))}
              </div>

              {/* Review */}
              <p className="flex-1 text-sm leading-7 text-gray-600">
                “{testimonial.review}”
              </p>

              {/* User Info */}
              <div className="mt-7 flex items-center gap-4 border-t border-[#eeeae3] pt-5">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${testimonial.color}`}
                >
                  {testimonial.initials}
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#202020]">
                    {testimonial.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {testimonial.role}
                  </p>
                </div>

                <FiArrowUpRight
                  size={18}
                  className="text-gray-400 transition-colors group-hover:text-[#a88957]"
                />
              </div>
            </article>
          ))}
        </div>

        {/* Demo Note */}
        <p className="mt-8 text-center text-xs text-gray-400">
          Sample testimonials created for this portfolio practice project.
        </p>
      </div>
    </section>
  );
};

export default Testimonials;