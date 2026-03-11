interface GroupDetailMembersListProps {
  title: string;
  data: any[];
}

export const GroupDetailMembersList = ({}: GroupDetailMembersListProps) => {
  return (
    <div className="divide-y divide-white/5">
      {mergedList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <Users className="h-5 w-5 text-white/20" />
          </div>
          <p className="text-sm text-white/30 italic">{t('no_members')}</p>
        </div>
      ) : (
        mergedList.map(({ user, status }) => {
          const role = getMemberRole(user);
          const isMe = user.id === currentUser.id;
          const isPending = status === 'pending';

          return (
            <div
              key={user.id}
              className={cn(
                'flex items-center justify-between p-4 transition-colors',
                isPending ? 'bg-warning/5 hover:bg-warning/10' : 'hover:bg-white/[0.02]',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ring-1',
                      isPending ? 'bg-warning/20 ring-warning/30' : 'bg-white/5 ring-white/10',
                    )}
                  >
                    {user.email?.slice(0, 2).toUpperCase()}
                  </div>
                  {role && !isPending && (
                    <div
                      className={cn(
                        'absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border border-white/10 bg-black text-[10px] font-bold',
                        role.color,
                      )}
                    >
                      {role.label}
                    </div>
                  )}
                  {isPending && (
                    <div className="bg-warning absolute -top-1 -right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full border border-black text-[10px] font-bold text-black">
                      !
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={cn('text-sm font-bold', isMe ? 'text-warning' : 'text-white')}>
                    {user.username || user.email}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-wider text-white/40 uppercase">
                      {isPending
                        ? t('pending_status')
                        : role
                          ? role.label === 'C'
                            ? t('captain')
                            : t('assistant')
                          : t('member')}
                    </span>
                    <span className="border-l border-white/10 pl-2 text-[10px] tracking-wider text-white/20 uppercase">
                      {user.subscription?.plan || 'Free'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isPending ? (
                  <>
                    <Button
                      size="icon"
                      className="h-8 w-8 cursor-pointer border border-emerald-500/30 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/40"
                      onClick={() => onApprove(user.id)}
                      title={t('approve')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="bg-destructive/20 text-destructive hover:bg-destructive/40 border-destructive/30 h-8 w-8 cursor-pointer border"
                      onClick={() => onReject(user.id)}
                      title={t('reject')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  !isMe && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAction(user.id, 'transfer')}
                        className="hover:text-warning hover:bg-warning/10 h-8 w-8 cursor-pointer text-white/40"
                        title={t('make_captain_tooltip')}
                      >
                        <Crown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAction(user.id, 'kick')}
                        className="hover:text-destructive hover:bg-destructive/10 h-8 w-8 cursor-pointer text-white/40"
                        title={t('kick_tooltip')}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
