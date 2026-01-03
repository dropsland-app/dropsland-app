"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface MembershipTier {
    id: string;
    name: string;
    price: number;
    currency: string;
    image?: string;
    color: string; // e.g., "bg-amber-500" for Gold
    benefits: string[];
    isPopular?: boolean;
}

interface MembershipTierCardProps {
    tier: MembershipTier;
    onJoin: (tierId: string) => void;
}

export function MembershipTierCard({ tier, onJoin }: MembershipTierCardProps) {
    return (
        <Card className="relative overflow-hidden border-none shadow-lg transition-all hover:scale-[1.02] bg-white group h-full flex flex-col">
            {/* Decorative Header / "Pass" Top */}
            <div className={`h-24 ${tier.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />

                {tier.isPopular && (
                    <Badge className="absolute top-3 right-3 bg-white/90 text-black border-none shadow-sm font-bold text-xs">
                        MOST POPULAR
                    </Badge>
                )}

                <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="font-extrabold text-xl tracking-tight">{tier.name}</h3>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Membership Pass</p>
                </div>
            </div>

            <CardContent className="pt-6 flex-1">
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-extrabold text-gray-900">{tier.price}</span>
                    <span className="text-sm font-bold text-gray-500">{tier.currency}/mo</span>
                </div>

                <div className="space-y-3">
                    {tier.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-green-50 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-gray-600 leading-tight">{benefit}</span>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="pb-6 pt-2">
                <Button
                    className="w-full h-12 rounded-xl font-bold text-base shadow-md transition-all active:scale-95"
                    style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }} // Black button
                    onClick={() => onJoin(tier.id)}
                >
                    Join {tier.name}
                </Button>
            </CardFooter>

            {/* Visual cue for "Access" - Top Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-b-lg backdrop-blur-sm" />
        </Card>
    );
}
