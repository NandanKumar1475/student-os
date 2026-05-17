import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  MapPin,
  RotateCcw,
} from 'lucide-react';
import { jobService } from '../services/jobService';

const safeArray = (value) => (Array.isArray(value) ? value : []);

const filters = [
  { label: 'All', value: '' },
  { label: 'Jobs', value: 'JOB' },
  { label: 'Hiring drives', value: 'HIRING_DRIVE' },
];

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadJobs = async () => {
      setLoading(true);

      try {
        const response = await jobService.getJobs(selectedType || undefined);

        if (active) {
          setJobs(safeArray(response.data));
        }
      } catch (error) {
        console.error(error);

        if (active) {
          setJobs([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadJobs();

    return () => {
      active = false;
    };
  }, [selectedType]);

  const counts = useMemo(() => {
    const all = jobs.length;
    const admin = jobs.filter((job) => job.source === 'Admin').length;
    const external = all - admin;

    return { admin, all, external };
  }, [jobs]);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.13),rgba(16,185,129,0.08),rgba(255,255,255,0.04))] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/60">Opportunities</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Jobs matched to your profile
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Real listings appear here from admin posts and job matches based on your career goal and skill targets.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-slate-950/30 p-3">
            <div className="px-3 py-2">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-2xl font-black text-white">{counts.all}</p>
            </div>
            <div className="px-3 py-2">
              <p className="text-xs text-slate-500">Admin</p>
              <p className="text-2xl font-black text-white">{counts.admin}</p>
            </div>
            <div className="px-3 py-2">
              <p className="text-xs text-slate-500">External</p>
              <p className="text-2xl font-black text-white">{counts.external}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value || 'all'}
            onClick={() => setSelectedType(filter.value)}
            className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
              selectedType === filter.value
                ? 'border-cyan-200/35 bg-cyan-300/15 text-cyan-100'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
          <RotateCcw className="mx-auto h-6 w-6 animate-spin text-cyan-200" />
          <p className="mt-3 text-sm text-slate-400">Loading live opportunities...</p>
        </div>
      ) : jobs.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {jobs.map((job) => (
            <a
              key={`${job.source || 'job'}-${job.id || job.externalUrl || job.title}`}
              href={job.externalUrl || undefined}
              target={job.externalUrl ? '_blank' : undefined}
              rel={job.externalUrl ? 'noreferrer' : undefined}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(8,18,30,0.72))] p-5 transition hover:border-cyan-200/25 hover:bg-white/8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                      {job.type || 'JOB'}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300">
                      {job.source || 'Live'}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-white">{job.title || 'Untitled opportunity'}</h2>
                </div>
                {job.externalUrl && <ExternalLink className="h-5 w-5 shrink-0 text-slate-500" />}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-cyan-200" />
                  {job.company || 'Company not listed'}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-200" />
                  {job.location || 'Location not listed'}
                </span>
              </div>

              {job.description && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">{job.description}</p>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-white/10 bg-white/4 p-8 text-center">
          <BriefcaseBusiness className="mx-auto h-10 w-10 text-cyan-200" />
          <h2 className="mt-4 text-2xl font-bold text-white">No opportunities yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            Add your career goal in Profile or create skill targets, then Student OS can pull real matches for your account.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/profile" className="inline-flex items-center gap-2 rounded-2xl border border-cyan-200/20 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-100">
              Update profile <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/targets" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-200">
              Add targets <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
