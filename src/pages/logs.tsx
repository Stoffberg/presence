import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import MapChart from '../components/Map';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

const Logs = ({ auth: session }: { auth: Session }) => {
    const { data: logs } = trpc.presence.getMany.useQuery();
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

    const selectedRecord = useMemo(() => {
        if (!selectedRecordId) return null;
        const record = logs?.find((log) => log.id === selectedRecordId);

        if (!record?.user.name || !record?.latitude || !record?.longitude) return null;
        return { name: record?.user.name, coordinates: [record?.longitude, record?.latitude] };
    }, [selectedRecordId, logs]);

    return (
        <>
            <Head>
                <title>Zamaqo | Presence</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />

                <meta name="application-name" content="PWA App" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="PWA App" />
                <meta name="description" content="Best PWA App in the world" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-config" content="/icons/browserconfig.xml" />
                <meta name="msapplication-TileColor" content="#2B5797" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#000000" />

                <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
                <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
                <link rel="shortcut icon" href="/favicon.ico" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://yourdomain.com" />
                <meta name="twitter:title" content="PWA App" />
                <meta name="twitter:description" content="Best PWA App in the world" />
                <meta name="twitter:image" content="https://yourdomain.com/icons/android-chrome-192x192.png" />
                <meta name="twitter:creator" content="@DavidWShadow" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="PWA App" />
                <meta property="og:description" content="Best PWA App in the world" />
                <meta property="og:site_name" content="PWA App" />
                <meta property="og:url" content="https://yourdomain.com" />
                <meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" />

                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
            </Head>
            <main className="absolute inset-0 flex justify-center items-start p-6 overflow-auto">
                {/* table to display all the logs */}
                <div className="border rounded-md shadow-md">
                    <table className="">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">User</th>
                                <th className="px-4 py-2 border-b">Timestamp</th>
                                <th className="px-4 py-2 border-b">Latitude</th>
                                <th className="px-4 py-2 border-b">Longitude</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs?.map((log) => (
                                <tr key={log.id} onClick={() => setSelectedRecordId(log.id)} className={`${log.id === selectedRecordId ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                                    <td className="px-4 py-2">{log.user.name}</td>
                                    <td className="px-4 py-2">{log.locationTimestamp?.toLocaleString()}</td>
                                    <td className="px-4 py-2">{log.latitude}</td>
                                    <td className="px-4 py-2">{log.longitude}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <MapChart markers={selectedRecord ? [selectedRecord] : []} />
                </div>
            </main>
        </>
    );
};

export default Logs;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: {
            auth: session,
        },
    };
};
