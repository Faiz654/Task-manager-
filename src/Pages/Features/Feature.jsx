import {
  FiCheckSquare,
  FiLayers,
  FiCalendar,
  FiFlag,
  FiTrendingUp,
  FiBarChart2,
} from "react-icons/fi";

const features = [
  {
    icon: FiCheckSquare,
    title: "Easy Task Management",
    description:
      "Create, update, and complete your tasks with a simple and intuitive workflow.",
  },
  {
    icon: FiLayers,
    title: "Stay Organized",
    description:
      "Keep your daily tasks organized in one place so nothing important gets lost.",
  },
  {
    icon: FiCalendar,
    title: "Set Deadlines",
    description:
      "Plan your work with deadlines and stay on track with your daily schedule.",
  },
  {
    icon: FiFlag,
    title: "Set Priorities",
    description:
      "Identify important tasks and focus on what matters most to you.",
  },
  {
    icon: FiTrendingUp,
    title: "Track Progress",
    description:
      "See your completed and pending tasks to understand how much you have achieved.",
  },
  {
    icon: FiBarChart2,
    title: "Boost Productivity",
    description:
      "Build better work habits and make every day more productive with a clear plan.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-[#faf9f6] px-6 py-20 sm:px-10 lg:px-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-[#e8e2d7] bg-white px-4 py-2 text-sm font-medium text-[#92754b]">
            Everything You Need
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-[#202020] sm:text-4xl lg:text-5xl">
            Powerful Features for
            <span className="block text-[#a88957]">
              Better Productivity
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            Manage your daily tasks, stay organized, and achieve more
            with tools designed to simplify your workflow.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[#eae6de] bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#c9b38c] hover:shadow-xl hover:shadow-[#202020]/5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#f5f0e7] text-[#9b7b49] transition-colors duration-300 group-hover:bg-[#a88957] group-hover:text-white">
                  <Icon size={26} />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-[#202020]">
                  {feature.title}
                </h3>

                <p className="text-sm leading-7 text-gray-600 sm:text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;