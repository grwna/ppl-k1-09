'use client';

import { DollarSign, Users, Percent } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  {
    icon: <DollarSign className="w-8 h-8" />,
    value: 'Rp 2.5B+',
    label: 'Total Donated',
    description: 'Funds raised from generous donors across Indonesia',
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: '500+',
    label: 'Students Helped',
    description: 'Lives transformed through accessible education funding',
  },
  {
    icon: <Percent className="w-8 h-8" />,
    value: '0%',
    label: 'Zero Interest Charged',
    description: 'Fully Sharia-compliant, ethical financial assistance',
  },
];

export const ImpactStats = () => {
  return (
    <section className="bg-[#07B0C8] text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact in Numbers</h2>
          <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-[#FCB82E]" />
          <p className="text-cyan-100 text-sm md:text-[15px] max-w-2xl mx-auto">
            Every number represents real lives changed through the power of educational giving.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/12 rounded-xl p-12 text-center border border-white/20 hover:bg-white/15 transition-all"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6 text-white">
                {stat.icon}
              </div>

              {/* Value */}
              <h3 className="text-2xl md:text-5xl font-bold mb-2 text-white">{stat.value}</h3>

              {/* Label */}
              <p className="text-lg font-semibold mb-3 text-white">{stat.label}</p>

              {/* Description */}
              <p className="text-cyan-100 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
