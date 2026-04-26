
import Image from "next/image";
import Link from "next/link";
import { Bell, CheckCircle2, CircleDollarSign, Info, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import RumahAmalHorizontalLogo from "../../../../public/rumah-amal-horizontal-logo.svg"
import UserPersonaLogo from "../../../../public/user_persona.svg"
import ChevronDownLogo from "../../../../public/chevron-down.svg"

import { useUserStore } from "@/hooks/userStore";

type NotificationItem = {
    id: string;
    type: string;
    message: string;
    scheduledAt: string;
    sentAt: string | null;
    isPending: boolean;
};

type NotificationsResponse = {
    pendingCount: number;
    notifications: NotificationItem[];
};

// init fonts
const plusJakartaSansFont = localFont({
    src: "../../../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    display: 'swap',
});

function formatNotificationTime(value: string) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function getNotificationVisual(type: string) {
    if (type === "LOAN_APPROVED") {
        return {
            icon: CheckCircle2,
            iconClassName: "bg-[#ECFDF5] text-[#059669]",
            railClassName: "bg-[#10B981]",
            label: "Approved",
        };
    }

    if (type === "LOAN_REJECTED") {
        return {
            icon: XCircle,
            iconClassName: "bg-[#FEF2F2] text-[#DC2626]",
            railClassName: "bg-[#EF4444]",
            label: "Rejected",
        };
    }

    if (type === "LOAN_FUNDING_ALLOCATED" || type === "DONATION_ALLOCATED") {
        return {
            icon: CircleDollarSign,
            iconClassName: "bg-[#FFFBEB] text-[#D97706]",
            railClassName: "bg-[#FCB82E]",
            label: "Funding",
        };
    }

    return {
        icon: Info,
        iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
        railClassName: "bg-[#3B82F6]",
        label: "Update",
    };
}

function showDesktopNotification(notification: NotificationItem) {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    new Notification("SalmanAid notification", {
        body: notification.message,
        tag: notification.id,
    });
}

function NotificationBellButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [desktopPermission, setDesktopPermission] = useState<NotificationPermission>("default");
    const containerRef = useRef<HTMLDivElement | null>(null);
    const deliveredIdsRef = useRef<Set<string>>(new Set());

    const fetchNotifications = useCallback(async () => {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
            setIsLoading(false);
            return;
        }

        try {
            setError(null);
            const response = await fetch("/api/notifications?limit=5", {
                cache: "no-store",
            });

            if (response.status === 401) {
                setNotifications([]);
                setPendingCount(0);
                setIsLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error("NOTIFICATIONS_FETCH_FAILED");
            }

            const data = (await response.json()) as NotificationsResponse;
            setNotifications(data.notifications);
            setPendingCount(data.pendingCount);
        } catch {
            setError("Notifications unavailable");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const requestDesktopPermission = useCallback(async () => {
        if (typeof window === "undefined" || !("Notification" in window)) return;
        if (Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            setDesktopPermission(permission);
            return;
        }

        setDesktopPermission(Notification.permission);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setDesktopPermission(Notification.permission);
        }

        fetchNotifications();

        const events = new EventSource("/api/notifications/events");

        events.addEventListener("notification", (event) => {
            const notification = JSON.parse(event.data) as NotificationItem;

            if (deliveredIdsRef.current.has(notification.id)) return;
            deliveredIdsRef.current.add(notification.id);

            setNotifications((current) => [
                notification,
                ...current.filter((item) => item.id !== notification.id),
            ].slice(0, 5));
            setPendingCount((current) => Math.max(current - 1, 0));
            showDesktopNotification(notification);
        });

        events.onerror = () => {
            setError("Reconnecting notifications...");
        };

        events.addEventListener("connected", () => {
            setError(null);
        });

        const handleOnline = () => fetchNotifications();
        const handleFocus = () => fetchNotifications();

        window.addEventListener("online", handleOnline);
        window.addEventListener("focus", handleFocus);

        return () => {
            events.close();
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("focus", handleFocus);
        };
    }, [fetchNotifications]);

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, []);

    const visibleBadgeCount = pendingCount > 9 ? "9+" : pendingCount.toString();

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                aria-label="Notifications"
                title="Notifications"
                onClick={() => {
                    setIsOpen((current) => !current);
                    requestDesktopPermission();
                    fetchNotifications();
                }}
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white text-[#111827] shadow-sm transition hover:border-[#FCB82E] hover:bg-[#FFF7E6] focus:outline-none focus:ring-2 focus:ring-[#FCB82E]/40"
            >
                <Bell size={20} strokeWidth={2.2} />
                {pendingCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4444] px-1.5 text-[11px] font-bold leading-none text-white ring-2 ring-white">
                        {visibleBadgeCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-14 z-50 w-[28rem] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-2xl">
                    <div className="border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className={`${plusJakartaSansFont.className} text-base font-bold text-[#111827]`}>
                                    Notifications
                                </div>
                                <div className="mt-1 text-xs text-[#6B7280]">
                                    Latest loan and funding updates
                                </div>
                            </div>
                            {pendingCount > 0 && (
                                <div className="rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#DC2626]">
                                    {pendingCount} new
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[28rem] space-y-3 overflow-y-auto bg-white p-4">
                        {isLoading && (
                            <div className="rounded-lg border border-[#E5E7EB] px-4 py-6 text-sm text-[#6B7280]">
                                Loading notifications...
                            </div>
                        )}

                        {!isLoading && error && (
                            <div className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-4 text-sm text-[#B45309]">
                                {error}
                            </div>
                        )}

                        {!isLoading && !error && notifications.length === 0 && (
                            <div className="rounded-lg border border-dashed border-[#D1D5DB] px-4 py-8 text-center text-sm text-[#6B7280]">
                                No notifications yet.
                            </div>
                        )}

                        {!isLoading && !error && notifications.map((notification) => {
                            const visual = getNotificationVisual(notification.type);
                            const Icon = visual.icon;

                            return (
                                <div
                                    key={notification.id}
                                    className="relative overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-sm"
                                >
                                    <div className={`absolute inset-y-0 left-0 w-1 ${visual.railClassName}`} />
                                    <div className="flex items-start gap-3 px-4 py-4 pl-5">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${visual.iconClassName}`}>
                                            <Icon size={20} strokeWidth={2.2} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                                                    {visual.label}
                                                </div>
                                                <div className="shrink-0 text-xs text-[#6B7280]">
                                                    {formatNotificationTime(notification.scheduledAt)}
                                                </div>
                                            </div>
                                            <div className="mt-1 text-sm leading-6 text-[#111827]">
                                                {notification.message}
                                            </div>
                                            {notification.isPending && (
                                                <div className="mt-2 inline-flex rounded-full bg-[#FFF7E6] px-2.5 py-1 text-xs font-medium text-[#B45309]">
                                                    Newly delivered
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-5 py-3 text-xs text-[#6B7280]">
                        {desktopPermission === "granted"
                            ? "Desktop notifications enabled"
                            : "Click the bell to allow desktop notifications"}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ApplicantDashboard_ApplicantNavbar() {

    const username = useUserStore((state) => (state.user?.username))
    
    return (
        // main container
        <div className="flex justify-between items-center h-[10%] p-2">

            {/* rumah amal salman logo */}
            <div className="flex relative w-[10%] justify-center items-center">
                <Image
                    src={RumahAmalHorizontalLogo}
                    alt="Logo Rumah Amal Salman"
                    width={100}
                    height={100}
                />
            </div>

            {/* navigations */}
            <div className="flex gap-x-10 w-[70%] justify-center items-center">

                {/* Home */}
                <div className="font-bold">
                    <Link href={'/applicant/dashboard'}>Dashboard</Link>
                </div>

                {/* Donate */}
                <div className="font-bold">
                    <Link href={'/applicant/apply'}>Apply Loan</Link>
                </div>

                {/* History */}
                <div className="font-bold">
                    <Link href={'/not-found'}>History</Link>
                </div>

                {/* Report */}
                <div className="font-bold">
                    <Link href={'/not-found'}>Installment</Link>
                </div>

            </div>

            {/* account */}
            <div className="flex w-[20%] justify-around items-center gap-3">

                <NotificationBellButton />

                {/* login */}
                <div className="flex relative w-[10%] justify-center items-center">
                    <Image
                        src={UserPersonaLogo}
                        alt="User Persona"
                        width={100}
                        height={100}
                    />
                </div>

                {/* register */}
                <div className="text-white font-bold bg-[#FCB82E] px-4 py-2 rounded-2xl">
                    {username}
                </div>

                {/* down chevron */}
                <div className="flex relative w-[10%] justify-center items-center">
                    <Image
                        src={ChevronDownLogo}
                        alt="Chevron down"
                        width={100}
                        height={100}
                    />
                </div>

            </div>

        </div>
    );
}
