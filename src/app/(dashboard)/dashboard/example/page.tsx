/**
 * DASHBOARD PAGE TEMPLATE
 * Template for authenticated dashboard sections.
 */

import { ExampleService } from "@/services/example.service";
import { createExampleAction } from "@/actions/example.action";
import NavigationBar from "@/components/ui/navbar";

export default async function DashboardExamplePage() {
  // Example of server-side data fetching through service
  const data = await ExampleService.findAll();

  return (    
    <div className="p-4 space-y-6 border rounded-lg bg-white/50">
      <NavigationBar/>
      <h2 className="text-xl font-bold">Dashboard Section Template</h2>
      <p>This section is for authenticated users and internal tools.</p>

      {/* Example data list */}
      <ul className="list-disc pl-5">
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      {/* Example form for Server Action */}
      <form action={createExampleAction} className="mt-4 flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">New Record Name</label>
        <input name="name" id="name" required className="border p-2 rounded-md" placeholder="Enter name..." />
        <button type="submit" className="bg-primary text-white p-2 rounded-md font-bold">Submit Action</button>
      </form>
    </div>
  );
}
