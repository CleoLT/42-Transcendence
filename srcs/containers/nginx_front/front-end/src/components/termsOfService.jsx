import { IconsOverlayFrame } from "./iconUtils"
import { Sixtyfour, P, H2, H3, LI, UL } from "./typography"

export function TermsOfServices() {
    return (
        <div className="flex flex-col relative w-full h-full justify-center items-center">
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative w-full max-w-3xl rounded-2xl p-8 max-h-[80vh] overflow-y-auto">
                <Sixtyfour className="text-2xl">Terms of Service</Sixtyfour>

                <P>Last updated: February 24, 2026</P>
                
                <P>
                    Welcome to the Blossom Clash Family. By accessing or using our platform, you agree to be bound by these Terms of Service.
        Please read them carefully. If you do not agree, you may not use our services.
                </P>

                <P>
                    By using our service, you agree to the collection and use of information in accordance with this policy.
                </P>

                <H2>1. Eligibility</H2>
                <UL>
                    <LI>You must be at least 13 years old to use Blossom Clash.</LI>
                    <LI>You must provide accurate and up-to-date information when creating an account.</LI>
                    <LI>You are responsible for maintaining the confidentiality of your account credentials.</LI>
                </UL>

                <H2>2. Account Registration</H2>
                <UL>
                    <LI>You may not share your password or allow others to access your account.</LI>
                    <LI>We may suspend or terminate accounts that violate these Terms.</LI>
                </UL>

                <H2>3. Acceptable Use</H2>
                <UL>
                    <LI>You agree not to use Blossom Clash for any unlawful purposes.</LI>
                    <LI>You may not attempt to hack, exploit, or interfere with the platform or other users’ accounts.</LI>
                    <LI>No impersonation, harassment, or abusive behavior is allowed.</LI>
                    <LI>Do not post offensive, illegal, or spam content.</LI>
                </UL>

                <H2>4. Friendships and Interactions</H2>
                <UL>
                    <LI>Interactions between users are the responsibility of the users themselves.</LI>
                    <LI>We reserve the right to remove or suspend accounts that abuse the friendship system.</LI>
                </UL>

                <H2>5. Intellectual Property</H2>
                <UL>
                    <LI>All content, branding, and intellectual property in Blossom Clash are owned by us.</LI>
                    <LI>Users may not copy, distribute, or create derivative works from our platform without permission.</LI>
                </UL>

                <H2>6. Termination</H2>
                <UL>
                    <LI>We may suspend or terminate accounts that violate these Terms or engage in prohibited activities.</LI>
                    <LI>Users may delete their accounts at any time.</LI>
                </UL>

                <H2>7. Limitation of Liability</H2>
                <P>
                    Blossom Clash is provided "as is" and we are not liable for damages resulting from your use of the platform, including data loss or service interruptions.
                </P>

                <H2>8. Changes to the Terms</H2>
                <P>
                    We reserve the right to update or modify these Terms at any time. Changes will be effective upon posting, with the updated date at the top.
                </P>

                <H2>9. Governing Law</H2>
                <P>
                    These Terms shall be governed by and construed in accordance with applicable laws. Any disputes will be subject to the jurisdiction of competent courts.
                </P>

                <H2>10. Contact Information</H2>
                <P>
                    If you have questions about these Terms, please contact us at:
                </P>

                <P>
                    Email: theblossomclash@gmail.com
                </P>
            </div>

        </div>
    )
}