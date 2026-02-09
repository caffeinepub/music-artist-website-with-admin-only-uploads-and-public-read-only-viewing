import { useGetProfile } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlatformInfo } from '@/utils/platformLinks';

export default function HomePage() {
  const { data: profile, isLoading } = useGetProfile();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        <div className="relative z-10 text-center px-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
          ) : profile ? (
            <>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">{profile.bio}</p>
            </>
          ) : (
            <div className="text-white/60">
              <p className="text-lg">Artist profile not yet configured</p>
            </div>
          )}
        </div>
      </section>

      {/* Social Links */}
      {profile && profile.socials.length > 0 && (
        <section className="py-12 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {profile.socials.map((social, index) => {
                const platformInfo = getPlatformInfo(social);
                return (
                  <a
                    key={index}
                    href={social}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-background border border-border rounded-full hover:border-amber-500 hover:text-amber-500 transition-all"
                  >
                    {platformInfo.icon}
                    <span className="text-sm font-medium">{platformInfo.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {profile && (
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About</h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">{profile.bio}</p>
          </div>
        </section>
      )}
    </div>
  );
}
