import { TodayState } from "@/components/TodayState";

export default function TodayPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="label">Training day</p>
        <h1 className="text-4xl font-black">Today</h1>
      </div>
      <TodayState />
    </div>
  );
}
