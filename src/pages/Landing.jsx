import { ArrowRight, BadgeCheck, Check, ChevronRight, CirclePlay, MapPin, Star, Store, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const proofPoints = ['No joining fee', 'Setup in minutes', 'Built for local growth'];

const Landing = () => (
  <main className="min-h-screen overflow-hidden bg-[#fffdf9] font-outfit text-slate-950">
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_12%,rgba(255,155,78,.2),transparent_23rem),radial-gradient(circle_at_10%_85%,rgba(255,208,131,.2),transparent_22rem)]" />

    <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
      <Link to="/" className="group flex items-center gap-2.5" aria-label="Fuudr home">
        <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-orange-500 text-lg font-black text-white shadow-[0_10px_25px_rgba(249,115,22,.32)] transition-transform group-hover:rotate-[-8deg]">F</span>
        <span className="text-xl font-black tracking-[-.06em]">fuudr</span>
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Link to="/signin" className="rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600">Sign in</Link>
        <Link to="/signup" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:px-5">Join Fuudr</Link>
      </div>
    </nav>

    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pb-24 lg:grid-cols-[.96fr_1.04fr] lg:gap-14 lg:px-10 lg:pb-28 lg:pt-14">
      <div className="relative z-10 max-w-2xl animate-slideUp">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-extrabold text-orange-700 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" /> THE PARTNER PLATFORM FOR FOOD BUSINESSES
        </div>
        <h1 className="text-[3.2rem] font-black leading-[.94] tracking-[-.07em] text-slate-950 sm:text-7xl lg:text-[5.35rem]">
          Your kitchen.<br />
          <span className="relative text-orange-500">More customers.<svg className="absolute -bottom-2 left-0 h-3 w-full text-orange-300" viewBox="0 0 250 12" fill="none"><path d="M2 9.5C77 1.5 155 1.5 248 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></span>
        </h1>
        <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
          Put your restaurant where local food lovers are looking. Create a beautiful menu, share your best dishes, and grow every day with Fuudr.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/signup" className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 text-base font-extrabold text-white shadow-[0_16px_30px_rgba(249,115,22,.28)] transition hover:-translate-y-1 hover:bg-orange-600">
            Start selling with Fuudr <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/signin" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-base font-bold text-slate-800 shadow-sm transition hover:border-orange-200 hover:bg-orange-50">
            <CirclePlay size={20} className="text-orange-500" /> I&apos;m already a partner
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
          {proofPoints.map((point) => <span key={point} className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><Check size={16} className="rounded-full bg-orange-100 p-0.5 text-orange-600" />{point}</span>)}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xl lg:mr-0">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border-[22px] border-orange-200/65" />
        <div className="absolute -bottom-12 -left-9 h-40 w-40 rounded-full bg-amber-200/55 blur-2xl" />
        <div className="relative overflow-hidden rounded-[2rem] border-[7px] border-white bg-slate-950 shadow-[0_30px_70px_rgba(60,25,5,.22)] sm:rounded-[2.5rem]">
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=90" alt="Fresh pizza served from a Fuudr partner kitchen" className="h-[480px] w-full object-cover sm:h-[560px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
            <div className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/90 px-3 py-2 shadow-lg backdrop-blur"><span className="grid h-7 w-7 place-items-center rounded-lg bg-orange-500 text-xs font-black text-white">F</span><span className="text-sm font-black">Fuudr Partner</span></div>
            <div className="flex items-center gap-1 rounded-full bg-slate-950/75 px-3 py-2 text-xs font-bold text-white backdrop-blur"><MapPin size={14} className="text-orange-400" /> Jaipur</div>
          </div>
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
            <div className="rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur sm:p-5">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-orange-600">Today at your restaurant</p><p className="mt-1 text-2xl font-black tracking-tight">Turn great food into growth.</p></div><div className="rounded-xl bg-emerald-100 p-2 text-emerald-600"><TrendingUp size={21} /></div></div>
              <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200"><div className="pr-3"><p className="text-xl font-black">24/7</p><p className="text-[10px] font-bold text-slate-500">online menu</p></div><div className="px-3"><p className="flex items-center gap-1 text-xl font-black"><Star size={16} className="fill-amber-400 text-amber-400" />4.9</p><p className="text-[10px] font-bold text-slate-500">happy guests</p></div><div className="pl-3"><p className="text-xl font-black">1 app</p><p className="text-[10px] font-bold text-slate-500">to manage it all</p></div></div>
            </div>
          </div>
        </div>
        <div className="absolute -left-4 top-[42%] hidden items-center gap-2 rounded-2xl border border-orange-100 bg-white px-3 py-3 shadow-xl sm:flex"><div className="rounded-xl bg-orange-100 p-2 text-orange-500"><Store size={19} /></div><div><p className="text-xs font-black">Built for partners</p><p className="text-[11px] font-medium text-slate-500">Simple. Fast. Local.</p></div></div>
      </div>
    </section>

    <section className="border-y border-orange-100 bg-white/65 px-5 py-7 backdrop-blur sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-600"><BadgeCheck size={22} /></span><p className="text-sm font-bold text-slate-700">A better way to build your restaurant&apos;s online presence.</p></div><Link to="/signup" className="group inline-flex items-center gap-1 text-sm font-black text-orange-600">Create your partner account <ChevronRight size={17} className="transition group-hover:translate-x-1" /></Link></div>
    </section>
  </main>
);

export default Landing;
