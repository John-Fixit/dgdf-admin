import { LeadershipCard } from './LeadershipCard'
import type { LeadershipMember } from '@/lib/types'

interface LeadershipGridProps {
  members: LeadershipMember[]
  onEdit: (member: LeadershipMember) => void
  onDelete: (member: LeadershipMember) => void
  canManage?: boolean
}

/**
 * Responsive card grid of leadership profiles.
 */
export function LeadershipGrid({
  members,
  onEdit,
  onDelete,
  canManage = true,
}: LeadershipGridProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {members.map((member, index) => (
        <LeadershipCard
          key={member.id}
          member={member}
          index={index}
          canManage={canManage}
          onEdit={() => onEdit(member)}
          onDelete={() => onDelete(member)}
        />
      ))}
    </div>
  )
}
