import { Mail } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/site';

// Invite les visiteurs à signaler un vitrail absent du catalogue (qui n'est pas exhaustif)
export default function OtherVitrailLink({ className = '' }: { className?: string }) {
  const subject = encodeURIComponent('Un autre vitrail de Jeannette Weiss Gruber');
  return (
    <p className={`text-sm text-gray-700 ${className}`}>
      Vous connaissez un autre vitrail de Jeannette Weiss Gruber ?{' '}
      <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}`} className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-blue-700">
        <Mail className="w-4 h-4" aria-hidden="true" />
        Écrivez-nous
      </a>
    </p>
  );
}
