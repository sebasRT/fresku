import { Admin } from "@fresku/model/tenants/users";
import { getAdminOTP, setAdminOTP } from "@fresku/redis/apps";
import resend from ".";

async function sendAdminOTP(adminInfo: Admin, tenantId: string) {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await setAdminOTP(tenantId, otp);

    const resendResult = await resend.emails.send({
        from: "Fresku <dev@fresku.app>",
        to: [adminInfo.email],
        subject: "Código de seguridad",
        html: `<div>
            <p>
            <strong>Fresku</strong> - Código de seguridad: ${otp} (Expira en 10 minutos) 
            </p> 
            </div>`,
    });

    return resendResult;
}

async function verifyAdminOTP(tenantId: string, otp: string | number) {
    const tenantOTP = await getAdminOTP(tenantId) // Replace with real lookup

    if (!tenantOTP) {
        return false;
    }
    return tenantOTP.toString() === otp.toString();
}

export { sendAdminOTP, verifyAdminOTP };

