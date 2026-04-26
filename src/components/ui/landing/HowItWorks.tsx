'use client';

interface Step {
  number: number;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Fund Donation',
    description:
      'Generous donors contribute to our collective fund, which enables us to provide interest-free loans to students who need it most.',
    color: 'bg-amber-500',
  },
  {
    number: 2,
    title: 'Application & Verification',
    description:
      'Students submit their applications, which undergo thorough review for verification and transparency to ensure independent approval.',
    color: 'bg-cyan-500',
  },
  {
    number: 3,
    title: 'Impactful Distribution',
    description:
      'Once approved, loans are distributed directly to students&apos; education accounts without any financial burden or interest charges.',
    color: 'bg-teal-600',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-18 md:py-24 bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-[#07B0C8]" />
          <p className="text-gray-500 text-sm md:text-[15px] max-w-2xl mx-auto">
            Our streamlined process ensures every donation makes a real impact and every student gets fair, transparent access.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Card */}
              <div className="bg-white rounded-xl p-7 h-full border border-gray-100 hover:shadow-md transition-shadow">
                {/* Step Number Circle */}
                <div
                  className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-6`}
                >
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-[20px] leading-none font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-[13.5px] text-gray-600 leading-relaxed">{step.description}</p>
              </div>

              {/* Connector Arrow (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300 text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
