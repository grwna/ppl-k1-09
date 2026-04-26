'use client';

import { Lock, FileText, Shield, BadgeCheck } from 'lucide-react';

interface TrustFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: TrustFeature[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Secure Payment Gateway',
    description: 'All donations are protected with bank-level encryption and secure processing',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Transparency Reports',
    description: "Access to our publicly published monthly reports on fund allocation and usage",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Data Privacy',
    description: 'Student data is secure and protected under strict privacy policies.',
  },
  {
    icon: <BadgeCheck className="w-5 h-5" />,
    title: 'Certified Non-Profit',
    description: 'Officially registered as a trusted social enterprise organization',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Open Audit Trail',
    description: 'Every transaction is tracked and available for audit purposes',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Shariah Compliant',
    description: 'All operations follow Islamic finance principles and ethical standards',
  },
];

const certifications = ['SSL Secured', 'PCI DSS Compliant', 'ISO 27001', 'Sharia Compliant'];

export const TrustTransparency = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trust & Transparency
          </h2>
          <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-[#07B0C8]" />
          <p className="text-gray-500 text-sm md:text-[15px] max-w-2xl mx-auto">
            Your trust is our foundation. We operate with complete transparency, security, and ethical financial management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-cyan-200 transition-all"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex rounded-full bg-[#07B0C8]/12 p-2 text-[#07B0C8]">{feature.icon}</div>

              {/* Title */}
              <h3 className="text-[16px] font-bold text-gray-900 mb-2.5">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-600 text-[13px] leading-relaxed mb-1">
                {feature.description}
              </p>

            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 border-t border-gray-200 pt-8">
          {certifications.map((item) => (
            <span
              key={item}
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[12px] font-medium text-gray-500"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
