import {
  FiUserPlus,
  FiList,
  FiCalendar,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

const steps = [
  {
    number: "01",
    icon: FiUserPlus,
    title: "Create Your Account",
    description:
      "Get started by creating your account or logging in to access your personal workspace.",
  },
  {
    number: "02",
    icon: FiList,
    title: "Add Your Tasks",
    description:
      "Create tasks with titles, descriptions, and deadlines to plan your daily activities.",
  },
  {
    number: "03",
    icon: FiCalendar,
    title: "Organize Your Day",
    description:
      "Arrange your tasks by priority and deadlines so you know what deserves attention first.",
  },
  {
    number: "04",
    icon: FiCheckCircle,
    title: "Complete & Track",
    description:
      "Mark tasks as completed and keep track of your progress as you move toward your goals.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-white px-6 py-20 sm:px-10 lg:px-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-[#e8e2d7] bg-[#faf9f6] px-4 py-2 text-sm font-medium text-[#92754b]">
            Simple Process
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-[#202020] sm:text-4xl lg:text-5xl">
            How It
            <span className="text-[#a88957]"> Works</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            Getting organized doesn't have to be complicated.
            Follow four simple steps to take control of your day.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                {/* Step Card */}
                <div className="group h-full rounded-2xl border border-[#eae6de] bg-[#faf9f6] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#c9b38c] hover:bg-white hover:shadow-xl hover:shadow-[#202020]/5">
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#eee6d8] text-[#92754b] transition-all duration-300 group-hover:bg-[#a88957] group-hover:text-white">
                      <Icon size={25} />
                    </div>

                    <span className="text-3xl font-bold text-[#e3dbcd] transition-colors duration-300 group-hover:text-[#c2a878]">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-[#202020]">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-7 text-gray-600">
                    {step.description}
                  </p>
                </div>

                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div className="pointer-events-none absolute -right-6 top-1/2 z-10 hidden -translate-y-1/2 text-[#c2a878] lg:block">
                    <FiArrowRight size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="mt-14 text-center">
          <p className="text-sm text-gray-500">
            Less time organizing.{" "}
            <span className="font-semibold text-[#92754b]">
              More time getting things done.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;