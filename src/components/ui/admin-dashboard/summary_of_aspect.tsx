import { type LucideIcon } from "lucide-react";

type SummaryOfAspectProps = {
  title: string;
  value: string | number;
  update_caption: string;
  icon: LucideIcon;
  icon_bg_color: string;
  value_color: string;
  update_caption_color: string;
};

export default function SummaryOfAspect({
  title,
  value,
  update_caption,
  icon: Icon,
  icon_bg_color,
  value_color,
  update_caption_color,
}: SummaryOfAspectProps) {
  return (
    <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1">
      {/* Left: text info */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium">{title}</span>
        <span className="text-xl font-bold leading-tight" style={{ color: value_color }}>
          {value}
        </span>
        <span className="text-xs font-semibold" style={{ color: update_caption_color }}>
          {update_caption}
        </span>
      </div>

      {/* Right: icon in colored circle */}
      <div
        className="flex justify-center items-center w-11 h-11 rounded-xl flex-shrink-0"
        style={{ backgroundColor: icon_bg_color }}
      >
        <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
      </div>
    </div>
  );
}
