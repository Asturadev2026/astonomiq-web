import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

export default function DummyPage() {
    return (
        <div className="flex min-h-screen flex-col items-start gap-8 p-24 max-w-4xl mx-auto">

            <section className="space-y-4 w-full">
                <Typography variant="h1">Typography System</Typography>
                <p className="text-zinc-500">Demonstration of Headings, Body, and Label styles.</p>
                <Separator />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
                {/* Body Section */}
                <section className="space-y-6">
                    <Typography variant="h1" as="h2" className="text-2xl">Body Styles</Typography>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-xs text-zinc-400">Body LG (16/24)</span>
                            <Typography variant="body-lg">
                                The quick brown fox jumps over the lazy dog.
                            </Typography>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-zinc-400">Body MD (14/20) - Default</span>
                            <Typography variant="body-md">
                                The quick brown fox jumps over the lazy dog.
                            </Typography>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-zinc-400">Body SM (12/16)</span>
                            <Typography variant="body-sm">
                                The quick brown fox jumps over the lazy dog.
                            </Typography>
                        </div>
                    </div>
                </section>

                {/* Label Section */}
                <section className="space-y-6">
                    <Typography variant="h1" as="h2" className="text-2xl">Label Styles</Typography>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-xs text-zinc-400">Label MD (14/20)</span>
                            <Typography variant="label-md">
                                Username Label
                            </Typography>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-zinc-400">Label SM (12/16)</span>
                            <Typography variant="label-sm">
                                Helper text or secondary label
                            </Typography>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-zinc-400">Label XS (10/16)</span>
                            <Typography variant="label-xs">
                                METADATA / TAG
                            </Typography>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    );
}
