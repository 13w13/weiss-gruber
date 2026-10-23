import { Mail } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/site';
import { useT } from '@/i18n';

// Invite les visiteurs à signaler un vitrail absent du catalogue (qui n'est pas exhaustif)
export default function OtherVitrailLink({ className = '' }: { className?: string }) {
  const t = useT();
  const subject = encodeURIComponent(t.otherVitrail.subject);
  return (
    <p className={`text-sm text-gray-700 ${className}`}>
      {t.otherVitrail.question}{' '}
      <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}`} className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-blue-700">
        <Mail className="w-4 h-4" aria-hidden="true" />
        {t.otherVitrail.cta}
      </a>
    </p>
  );
}
