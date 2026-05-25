import { TenantMeta } from "@fresku/model/tenants";
import { cn } from "@fresku/utils/functions/styles";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import styles from "./createTenant.module.scss";

const TenantDomain = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TenantMeta>();

  const ownDomain = watch("domainType") === "domain";

  return (
    <div className={styles.tenantDomain}>
      <label className={clsx([styles.domain, styles.input])}>
        <input
          id="domain"
          type="text"
          {...register("domain", {})}
          placeholder={ownDomain ? "dominio" : "subdominio"}
        />
        <span
          className={cn([
            "transition-all opacity-80",
            { "opacity-0": ownDomain },
          ])}
        >
          .fresku.app
        </span>
      </label>

      <label className={styles.domainType}>
        <span>{errors.domain?.message}</span>
        <span>custom</span>
        <input
          type="checkbox"
          onChange={(e) => {
            setValue("domainType", e.target.checked ? "domain" : "subdomain");
          }}
        />
      </label>

      <input type="text" {...register("tenantId")} hidden />
    </div>
  );
};

export default TenantDomain;
