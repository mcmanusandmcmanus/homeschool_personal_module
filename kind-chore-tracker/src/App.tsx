import { useMemo, useState } from 'react'
import {
  ShieldCheck,
  Smile,
  Star,
  Trash2,
  Bed,
  Shirt,
  Utensils,
  Sparkles,
  BookOpen,
  Plus,
  Check,
  Undo2,
  Clock3,
  Heart,
} from 'lucide-react'

type View = 'landing' | 'parent' | 'student'
type ChoreStatus = 'assigned' | 'pending' | 'completed'

type Student = {
  id: string
  name: string
  age: number
  avatar: string
  panel: string
}

type ChoreType = {
  id: string
  label: string
  iconKey: keyof typeof ICON_LIBRARY
}

type Chore = {
  id: number
  studentId: string
  type: string
  label: string
  status: ChoreStatus
  timestamp: number
}

const STUDENTS: Student[] = [
  { id: 's1', name: 'Leo', age: 3, avatar: '🦊', panel: 'from-amber-50 to-orange-100' },
  { id: 's2', name: 'Mia', age: 7, avatar: '🐝', panel: 'from-rose-50 to-pink-100' },
  { id: 's3', name: 'Sam', age: 12, avatar: '🐢', panel: 'from-emerald-50 to-green-100' },
]

const ICON_LIBRARY = {
  bed: Bed,
  clean: Sparkles,
  dishes: Utensils,
  laundry: Shirt,
  homework: BookOpen,
  star: Star,
  heart: Heart,
}

const INITIAL_CHORE_TYPES: ChoreType[] = [
  { id: 'bed', label: 'Make Bed', iconKey: 'bed' },
  { id: 'clean', label: 'Tidy Room', iconKey: 'clean' },
  { id: 'dishes', label: 'Dishes', iconKey: 'dishes' },
  { id: 'laundry', label: 'Laundry', iconKey: 'laundry' },
  { id: 'homework', label: 'Homework', iconKey: 'homework' },
]

const INITIAL_CHORES: Chore[] = [
  { id: 1, studentId: 's1', type: 'bed', label: 'Make Bed', status: 'assigned', timestamp: Date.now() },
  { id: 2, studentId: 's1', type: 'clean', label: 'Pick Up Toys', status: 'pending', timestamp: Date.now() },
  { id: 3, studentId: 's2', type: 'homework', label: 'Read 20 Minutes', status: 'completed', timestamp: Date.now() },
  { id: 4, studentId: 's3', type: 'dishes', label: 'Load Dishwasher', status: 'assigned', timestamp: Date.now() },
]

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [currentUser, setCurrentUser] = useState<Student | null>(null)
  const [chores, setChores] = useState<Chore[]>(INITIAL_CHORES)
  const [choreTypes, setChoreTypes] = useState<ChoreType[]>(INITIAL_CHORE_TYPES)
  const [selectedChoreType, setSelectedChoreType] = useState<string>(INITIAL_CHORE_TYPES[0].id)
  const [isCreatingType, setIsCreatingType] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newIcon, setNewIcon] = useState<keyof typeof ICON_LIBRARY>('star')

  const getIcon = (iconKey: string) => ICON_LIBRARY[iconKey as keyof typeof ICON_LIBRARY] || Star
  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400'

  const addChore = (studentId: string) => {
    const template = choreTypes.find((c) => c.id === selectedChoreType)
    if (!template) return
    const newChore: Chore = {
      id: Date.now(),
      studentId,
      type: template.id,
      label: template.label,
      status: 'assigned',
      timestamp: Date.now(),
    }
    setChores((prev) => [...prev, newChore])
  }

  const updateChoreStatus = (choreId: number, status: ChoreStatus) => {
    setChores((prev) => prev.map((c) => (c.id === choreId ? { ...c, status } : c)))
  }

  const deleteChore = (choreId: number) => setChores((prev) => prev.filter((c) => c.id !== choreId))

  const createChoreType = () => {
    if (!newLabel.trim()) return
    const newType: ChoreType = { id: `custom-${Date.now()}`, label: newLabel.trim(), iconKey: newIcon }
    setChoreTypes((prev) => [...prev, newType])
    setSelectedChoreType(newType.id)
    setIsCreatingType(false)
    setNewLabel('')
    setNewIcon('star')
  }

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col items-center justify-center px-4 py-8 sm:py-12 font-sans">
      <div className="text-center mb-10 max-w-2xl">
        <p className="text-sm font-semibold text-orange-500 tracking-wide uppercase">Welcome, Home Team</p>
        <h1 className="text-4xl font-extrabold text-slate-800 mt-2">Kind Chore Club</h1>
        <p className="text-slate-600 mt-3">
          Parents assign missions. Kids finish them. Parents give the final thumbs-up. No cameras - just kindness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-3xl">
        <button
          onClick={() => setView('parent')}
          className={`bg-white p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border-4 border-slate-100 flex flex-col items-center min-h-[56px] ${focusRing}`}
        >
          <div className="bg-slate-800 text-white p-4 rounded-full mb-4 shadow-md">
            <ShieldCheck size={48} />
          </div>
          <span className="text-2xl font-bold text-slate-800">Parents</span>
          <span className="text-slate-400 mt-2">Assign & approve completions</span>
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-blue-100 flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Smile size={48} className="text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-blue-600 mb-4 sm:mb-6">Kids, pick your badge</span>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
            {STUDENTS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentUser(s)
                  setView('student')
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-blue-50 transition-transform hover:scale-105 min-h-[56px] ${focusRing}`}
              >
                <span className="text-4xl">{s.avatar}</span>
                <span className="text-sm font-semibold text-slate-700">
                  {s.name} · {s.age}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const StudentView = () => {
    const myChores = useMemo(() => chores.filter((c) => c.studentId === currentUser?.id), [chores, currentUser])
    const sorted = [...myChores].sort((a, b) => {
      const order = { assigned: 1, pending: 2, completed: 3 }
      return order[a.status] - order[b.status]
    })

    const PendingBadge = () => (
      <div className="flex items-center justify-center gap-2 text-purple-700 font-bold text-lg bg-purple-100 py-4 px-3 rounded-2xl">
        <Clock3 className="animate-pulse" />
        <span>Waiting for parent high-five</span>
      </div>
    )

    const DoneBadge = () => (
      <div className="flex items-center justify-center gap-2 text-green-700 font-bold text-lg bg-green-100 py-4 px-3 rounded-2xl">
        <Check className="stroke-[3px]" />
        <span>Approved - great job!</span>
      </div>
    )

    if (!currentUser) return null

    return (
      <div className={`min-h-screen bg-gradient-to-b ${currentUser.panel} px-4 sm:px-6 pb-24 pt-6`}>
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{currentUser.avatar}</span>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">Hi, {currentUser.name}!</h1>
              <p className="text-slate-700 font-medium">You have {sorted.filter((c) => c.status === 'assigned').length} missions ready.</p>
            </div>
          </div>
          <button
            onClick={() => setView('landing')}
            className={`bg-white/70 p-3 rounded-full hover:bg-white text-slate-600 shadow-sm ${focusRing}`}
            aria-label="Back to start"
          >
            <Undo2 size={22} />
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {sorted.length === 0 && (
            <div className="col-span-full text-center py-16 opacity-80">
              <div className="text-6xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-slate-700">All done - high five!</h2>
            </div>
          )}

          {sorted.map((chore) => {
            const template = choreTypes.find((t) => t.id === chore.type) || { iconKey: 'star' }
            const Icon = getIcon(template.iconKey)
            const isDone = chore.status === 'completed'
            const isPending = chore.status === 'pending'

            let cardStyle = 'bg-white border-b-8 border-slate-200'
            if (isPending) cardStyle = 'bg-purple-50 border-b-8 border-purple-200'
            if (isDone) cardStyle = 'bg-green-50 border-b-8 border-green-200 opacity-90'

            return (
              <div key={chore.id} className={`relative rounded-[1.6rem] p-6 shadow-lg transition-all duration-300 ${cardStyle}`}>
                <div className="flex flex-col items-center text-center mb-6">
                  <div
                    className={`p-4 rounded-full mb-4 ${
                      isDone ? 'bg-green-100 text-green-700' : isPending ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <Icon size={60} strokeWidth={1.6} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{chore.label}</h3>
                  <p className="text-sm text-slate-600 mt-2">
                    {chore.status === 'assigned' && 'Give it a try, then tap "I finished!"'}
                    {chore.status === 'pending' && 'Mom or Dad will check this soon.'}
                    {chore.status === 'completed' && 'Parent approved - woohoo!'}
                  </p>
                </div>

                <div className="mt-auto">
                  {chore.status === 'assigned' && (
                    <button
                      onClick={() => updateChoreStatus(chore.id, 'pending')}
                      className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-4 rounded-2xl shadow-md active:translate-y-1 transition-all min-h-[56px] ${focusRing}`}
                    >
                      I finished!
                    </button>
                  )}
                  {isPending && <PendingBadge />}
                  {isDone && <DoneBadge />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const ParentView = () => {
    const pendingChores = chores.filter((c) => c.status === 'pending')

    return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 pb-24 pt-8 font-sans">
        <header className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 text-white p-3 rounded-xl shadow-md">
              <ShieldCheck size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Parent Dashboard</h1>
              <p className="text-sm text-slate-600">Assign chores. Kids mark done. You approve manually.</p>
            </div>
          </div>
          <button onClick={() => setView('landing')} className={`text-slate-500 hover:text-slate-700 font-medium self-start ${focusRing}`}>
            Exit
          </button>
        </header>

        <div className="max-w-4xl mx-auto grid gap-10">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              Needs Approval
              {pendingChores.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingChores.length}</span>}
            </h2>
            {pendingChores.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border-2 border-dashed border-slate-200">
                No chores waiting for review.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingChores.map((chore) => {
                  const student = STUDENTS.find((s) => s.id === chore.studentId)
                  const template = choreTypes.find((t) => t.id === chore.type) || { iconKey: 'star' }
                  const Icon = getIcon(template.iconKey)

                  return (
                    <div
                      key={chore.id}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{student?.avatar}</div>
                        <div>
                          <div className="font-bold text-slate-900">{chore.label}</div>
                          <div className="text-sm text-slate-600 flex items-center gap-2">
                            <Icon size={16} /> {student?.name} says it is done.
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateChoreStatus(chore.id, 'assigned')}
                          className={`px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-sm min-h-[44px] ${focusRing}`}
                        >
                          Needs work
                        </button>
                        <button
                          onClick={() => updateChoreStatus(chore.id, 'completed')}
                          className={`px-6 py-2 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-200 text-sm min-h-[44px] ${focusRing}`}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Assign a New Mission</h2>
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-lg border border-slate-100">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Chore type</label>
                  {!isCreatingType && <span className="text-xs text-blue-500 font-medium">scroll for more ↓</span>}
                </div>

                {!isCreatingType ? (
                  <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-3">
                    {choreTypes.map((item) => {
                      const Icon = getIcon(item.iconKey)
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedChoreType(item.id)}
                          className={`flex-shrink-0 flex flex-col items-center p-4 rounded-xl border-2 transition-all w-24 min-h-[72px] ${focusRing} ${
                            selectedChoreType === item.id
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-slate-100 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <Icon size={24} className="mb-2" />
                          <span className="text-xs font-bold text-center leading-tight">{item.label}</span>
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setIsCreatingType(true)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-500 w-24 transition-colors min-h-[72px] ${focusRing}`}
                    >
                      <Plus size={24} className="mb-2" />
                      <span className="text-xs font-bold">New</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-slate-800">Create custom chore</h3>
                      <button onClick={() => setIsCreatingType(false)} className={`text-slate-500 hover:text-red-500 text-sm ${focusRing}`}>
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Name</label>
                        <input
                          type="text"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          placeholder="e.g. Water plants"
                          className={`w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none ${focusRing}`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Pick an icon</label>
                        <div className="grid grid-cols-6 gap-2">
                          {Object.keys(ICON_LIBRARY).map((key) => {
                            const Icon = ICON_LIBRARY[key as keyof typeof ICON_LIBRARY]
                            return (
                              <button
                                key={key}
                                onClick={() => setNewIcon(key as keyof typeof ICON_LIBRARY)}
                                className={`p-2 rounded-lg flex items-center justify-center transition-all min-h-[44px] ${focusRing} ${
                                  newIcon === key
                                    ? 'bg-blue-500 text-white shadow-md scale-110'
                                    : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
                                }`}
                              >
                                <Icon size={20} />
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <button
                        onClick={createChoreType}
                        disabled={!newLabel.trim()}
                        className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] ${focusRing}`}
                      >
                        Save and select
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Assign to</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {STUDENTS.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => addChore(student.id)}
                    className={`bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl flex items-center gap-3 transition-colors group min-h-[56px] ${focusRing}`}
                  >
                    <span className="text-2xl group-active:scale-125 transition-transform">{student.avatar}</span>
                    <div className="text-left">
                      <div className="font-bold text-slate-700 text-sm">Assign to</div>
                      <div className="font-extrabold text-slate-900">{student.name}</div>
                    </div>
                    <div className="ml-auto bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-slate-300 group-hover:text-blue-500">
                      +
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="opacity-90">
            <h2 className="text-xl font-bold text-slate-800 mb-4">All Active Chores</h2>
            <div className="space-y-2">
              {chores.filter((c) => c.status !== 'completed').map((c) => {
                const student = STUDENTS.find((s) => s.id === c.studentId)
                const template = choreTypes.find((t) => t.id === c.type) || { iconKey: 'star' }
                const Icon = getIcon(template.iconKey)
                return (
                  <div key={c.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <span>{student?.avatar}</span>
                      <span className="font-medium text-slate-800">{c.label}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          c.status === 'pending' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <Icon size={16} />
                      <button onClick={() => deleteChore(c.id)} className={`hover:text-red-500 ${focusRing} min-h-[32px]`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <>
      {view === 'landing' && <LandingPage />}
      {view === 'student' && <StudentView />}
      {view === 'parent' && <ParentView />}
    </>
  )
}
