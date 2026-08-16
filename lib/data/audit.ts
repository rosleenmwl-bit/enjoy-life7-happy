import { createClient } from "@/lib/supabase/server";

export async function createAuditLog(input: {
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("audit_logs").insert({
    user_id: null,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId,
    details: input.details ?? {},
  });

  if (error) throw new Error(`Could not write audit log: ${error.message}`);
}
