
import {IconsOverlayFrame} from "./iconUtils"
import { CorbenBold, Sixtyfour, P, H2, H3, LI, UL } from "./typography"



export function Privacy() {
    return (
        <div className="flex flex-col relative w-full h-full justify-center items-center">
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative w-full max-w-3xl rounded-2xl  p-8 max-h-[80vh] overflow-y-auto">
                <Sixtyfour className="text-2xl">Privacy Policy</Sixtyfour>
                <br/>
                <P>Last updated: February 24, 2026</P>
                <br/>
                <P>
                    Welcome to the Blossom Clash Family.
                    This Privacy Policy explains how we collect, use, and protect your information when you use our application.
                </P>

                <P>
                    By using our service, you agree to the collection and use of information in accordance with this policy.
                </P>

                <H2>1. Information We Collect</H2>

                <H3>Account Information</H3>
                <UL>
                    <LI>Username</LI>
                    <LI>Email address</LI>
                    <LI>Avatar</LI>
                    <LI>Biography</LI>
                    <LI>Online status</LI>
                </UL>

                <H3>Authentication Data</H3>
                <UL>
                    <LI>JSON Web Tokens (JWT) for session authentication</LI>
                    <LI>Session cookies</LI>
                    <LI>Two-Factor Authentication (2FA) via Google email verification</LI>
                </UL>

                <H3>Technical Information</H3>
                <UL>
                    <LI>IP address</LI>
                    <LI>Basic usage data necessary for maintaining the service</LI>
                </UL>

                <P>
                    All data is stored securely in our MariaDB database infrastructure.
                </P>


                <H2>2. How We Use Your Information</H2>
                <UL>
                    <LI>Create and manage user accounts</LI>
                    <LI>Provide friendship and invitation features</LI>
                    <LI>Authenticate users securely</LI>
                    <LI>Maintain session integrity using JWT and cookies</LI>
                    <LI>Enable Two-Factor Authentication (2FA)</LI>
                    <LI>Improve platform security</LI>
                    <LI>Protect against unauthorized access or abuse</LI>
                </UL>

                <P>
                    We only collect information necessary to provide and maintain our services.
                </P>


                <H2>3. Data Sharing</H2>
                <P>
                    We do not sell, rent, or share your personal data with third parties.
                </P>
                <P>
                    Your information is used exclusively for the operation and security of Blossom Clash.
                </P>


                <H2>4. Data Security</H2>
                <UL>
                    <LI>Encrypted passwords</LI>
                    <LI>HTTPS secure connections</LI>
                    <LI>JWT-based authentication</LI>
                    <LI>Secure session cookies</LI>
                    <LI>Protection against unauthorized access</LI>
                    <LI>Server-side validation and authentication checks</LI>
                </UL>

                <P>
                    While we strive to protect your information, no online system can guarantee 100% security.
                </P>


                <H2>5. User Rights</H2>
                <UL>
                    <LI>You can delete your account at any time</LI>
                    <LI>You can request the deletion of your personal data</LI>
                    <LI>You can modify or update your account information</LI>
                    <LI>You can request information about the data we store about you</LI>
                </UL>

                <P>
                    To exercise any of these rights, please contact us at the email provided below.
                </P>


                <H2>6. Data Retention</H2>
                <P>
                    We retain your personal information only as long as your account remains active or as necessary to provide our services.
                    If you delete your account, your personal data will be permanently removed from our systems within a reasonable timeframe.
                </P>

                <H2>7. Contact Information</H2>
                <P>
                    If you have any questions about this Privacy Policy or your personal data, you may contact us at:
                </P>

                <P>
                    Email: theblossomclash@gmail.com
                </P>
            </div>

        </div>
    )
}