import { Topbar } from "@/components/crm/Topbar";
import { ContactsTable } from "@/components/crm/ContactsTable";
import { apiClient } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  let contacts: any[] = [];
  let accounts: any[] = [];

  const defaultContacts = [
    {
      id: "c-1",
      firstName: "Ramesh",
      lastName: "Krishnan",
      phone: "+919842155678",
      email: "ramesh@ranipetexports.in",
      designation: "Managing Director",
      isPrimary: true,
      account: { id: "a-1", name: "Ranipet Leather Works Pvt Ltd", city: "Ranipet" },
      deals: [{ id: "d-1", title: "Multilingual Leather Export Portal", dealValue: 85000, stage: "DISCOVERY" }],
    },
    {
      id: "c-2",
      firstName: "Syed",
      lastName: "Ibrahim",
      phone: "+919443211223",
      email: "syed@vnbspices.com",
      designation: "Founder & CEO",
      isPrimary: true,
      account: { id: "a-2", name: "Vaniyambadi Spices Exporters", city: "Vaniyambadi" },
      deals: [{ id: "d-2", title: "Automated WhatsApp Bot", dealValue: 48000, stage: "PROPOSAL_SENT" }],
    },
    {
      id: "c-3",
      firstName: "Farhan",
      lastName: "Ahmed",
      phone: "+919443299881",
      email: "farhan@amburtanners.com",
      designation: "Partner",
      isPrimary: true,
      account: { id: "a-3", name: "Ambur Tanners Association", city: "Ambur" },
      deals: [{ id: "d-3", title: "Brand Identity Kit", dealValue: 35000, stage: "CLOSED_WON" }],
    },
  ];

  try {
    const [cntRes, accRes] = await Promise.allSettled([
      apiClient.contacts.list(),
      apiClient.accounts.list(),
    ]);

    if (cntRes.status === "fulfilled" && Array.isArray(cntRes.value.data) && cntRes.value.data.length > 0) {
      contacts = cntRes.value.data;
    } else {
      contacts = defaultContacts;
    }

    if (accRes.status === "fulfilled" && Array.isArray(accRes.value.data)) {
      accounts = accRes.value.data;
    }
  } catch {
    contacts = defaultContacts;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Agency Contacts Directory"
        subtitle="Individual decision makers and stakeholders across client organizations"
      />

      <div className="p-8 max-w-7xl w-full">
        <ContactsTable initialContacts={contacts} />
      </div>
    </div>
  );
}
