import CreateTenantForm from "@/components/createTenant/CreateTenantForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CreateTenantForm />
    </main>
  );
}
