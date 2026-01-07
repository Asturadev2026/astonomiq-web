import { Typography } from "@/components/ui/typography";

export default function DummyPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
            <div className="space-y-2 text-center">
                <Typography variant="h1">Default H1 Style</Typography>
                <p className="text-zinc-500">This uses the default H1 variant settings.</p>
            </div>

            <div className="space-y-2 text-center">
                <Typography variant="h1" className="text-blue-500">
                    H1 with Color Override
                </Typography>
                <p className="text-zinc-500">Passing className="text-blue-500"</p>
            </div>

            <div className="space-y-2 text-center">
                <Typography variant="h1" as="h2">
                    H1 Visual, H2 HTML Tag
                </Typography>
                <p className="text-zinc-500">Polymorphic "as" prop usage</p>
            </div>
        </div>
    );
}
