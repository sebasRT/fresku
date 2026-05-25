import { tenantSchema } from "@fresku/model/tenants/metadata";
import { z } from "zod/v4";

const resolver = tenantSchema.omit({
  tenantId: true
});

type TenantToCreate = z.infer<typeof resolver>;

export { resolver, type TenantToCreate };

