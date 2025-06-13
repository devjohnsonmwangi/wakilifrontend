import React, { useState, useEffect, FC, useRef } from 'react';
// IMPORTANT: Adjust this import path to where your RTK Query API slice is actually located in your project.
import { useGetCaseProgressForCaseQuery, useCreateCaseProgressRecordMutation, useUpdateCaseProgressRecordMutation, useDeleteCaseProgressRecordMutation, CaseProgressData } from '../../../../features/case/caseAPI'; 
import { X, PlusCircle, Trash2, LoaderCircle, Calendar, MessageSquareText, Pencil, Save, History } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper: Date Formatter ---
const formatDateTime = (isoString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(isoString));
};

// --- Props Interface ---
interface CaseProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: number;
  caseNumber?: string;
  isReadOnly?: boolean;
}

// --- Sub-Components ---
const ProgressItemSkeleton: FC = () => (
  <div className="relative pl-8 py-4 animate-pulse">
    <div className="absolute left-0 top-6 h-full w-0.5 bg-slate-200 dark:bg-slate-700"></div>
    <div className="absolute left-[-5px] top-6 h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
    <div className="h-5 bg-slate-300 dark:bg-slate-600 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
  </div>
);

interface ProgressItemProps {
    item: CaseProgressData;
    isReadOnly?: boolean;
    isBusy: boolean;
    isEditing: boolean;
    isUpdating: boolean;
    onStartEdit: (item: CaseProgressData) => void;
    onCancelEdit: () => void;
    onSaveEdit: () => Promise<void>;
    onDelete: (id: number) => void;
    editTitle: string;
    setEditTitle: (value: string) => void;
    editDetails: string;
    setEditDetails: (value: string) => void;
}

const ProgressItem: FC<ProgressItemProps> = ({ item, isReadOnly, isBusy, isEditing, isUpdating, onStartEdit, onCancelEdit, onSaveEdit, onDelete, editTitle, setEditTitle, editDetails, setEditDetails }) => {
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-expanding textarea logic
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to shrink if text is deleted
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to content height
        }
    }, [editDetails, isEditing]);

    const handleSaveSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSaveEdit();
    };

    if (isEditing && !isReadOnly) {
        // --- EDITING VIEW ---
        return (
            <div className="relative pl-8 py-4 border-l border-blue-500/50 dark:border-sky-500/50 bg-blue-50 dark:bg-slate-900/50 rounded-r-lg my-2">
                <div className="absolute left-[-9px] top-6 h-4 w-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-800"></div>
                <form onSubmit={handleSaveSubmit} className="space-y-3">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 text-md font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 dark:text-white"
                        placeholder="Progress Title"
                    />
                    <textarea
                        ref={textareaRef}
                        value={editDetails}
                        onChange={(e) => setEditDetails(e.target.value)}
                        rows={1} // Start with a single row
                        className="w-full px-3 py-2 text-sm font-medium bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 dark:text-white overflow-y-auto resize-none max-h-48" // Key styles for auto-expand
                        placeholder="Details (Optional)"
                    />
                    <div className="flex items-center justify-end space-x-2 pt-2">
                        <button type="button" onClick={onCancelEdit} className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" disabled={isUpdating} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                            {isUpdating ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span className="ml-1.5 font-bold">Save</span>
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // --- DISPLAY VIEW ---
    return (
        <div className="relative pl-8 py-4 border-l border-slate-200 dark:border-slate-700">
            <div className="absolute left-[-9px] top-6 h-4 w-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-800"></div>
            <div className="flex justify-between items-start">
                <div className="flex-grow pr-4">
                    <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">{item.title}</h3>
                    {item.details && <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{item.details}</p>}
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {formatDateTime(item.created_at)}
                        {item.updater && <span className="ml-2 font-bold">by {item.updater.full_name}</span>}
                    </p>
                </div>
                {!isReadOnly && (
                    <div className="flex items-center space-x-1 flex-shrink-0">
                        <button onClick={() => onStartEdit(item)} disabled={isBusy} className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-sky-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Edit progress">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(item.progress_id)} disabled={isBusy} className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Delete progress">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Modal Component ---
export const CaseProgressModal: FC<CaseProgressModalProps> = ({ isOpen, onClose, caseId, caseNumber, isReadOnly = false }) => {
    const { data: progressRecords, isLoading, isError } = useGetCaseProgressForCaseQuery(caseId, { skip: !isOpen });
    const [createRecord, { isLoading: isCreating }] = useCreateCaseProgressRecordMutation();
    const [updateRecord, { isLoading: isUpdating }] = useUpdateCaseProgressRecordMutation();
    const [deleteRecord] = useDeleteCaseProgressRecordMutation();

    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDetails, setNewDetails] = useState('');
    
    const [editingProgressId, setEditingProgressId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDetails, setEditDetails] = useState('');

    const isBusy = isAdding || editingProgressId !== null;

    useEffect(() => {
        if (!isOpen) { setIsAdding(false); setEditingProgressId(null); }
    }, [isOpen]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || isReadOnly) return;
        const promise = createRecord({ caseId, title: newTitle, details: newDetails }).unwrap();
        toast.promise(promise, { loading: 'Saving...', success: 'Progress added!', error: 'Failed to add record.' });
        try { await promise; setNewTitle(''); setNewDetails(''); setIsAdding(false); } catch (err) { /* Toast handles error */ }
    };

    const handleDelete = async (progressId: number) => {
        if (isReadOnly || isBusy) return;
        const promise = deleteRecord({ progressId, caseId }).unwrap();
        toast.promise(promise, { loading: 'Deleting...', success: 'Record deleted.', error: 'Failed to delete.' });
    };

    const handleStartEdit = (item: CaseProgressData) => {
        if (isBusy) return;
        setEditingProgressId(item.progress_id);
        setEditTitle(item.title);
        setEditDetails(item.details || '');
        setIsAdding(false);
    };

    const handleCancelEdit = () => setEditingProgressId(null);

    const handleSaveEdit = async () => {
        if (!editTitle.trim() || isReadOnly || !editingProgressId) return;
        const promise = updateRecord({ progressId: editingProgressId, caseId, title: editTitle, details: editDetails }).unwrap();
        toast.promise(promise, { loading: 'Updating...', success: 'Progress updated!', error: 'Failed to update.' });
        try { await promise; setEditingProgressId(null); } catch (err) { /* Toast handles error */ }
    };
    
    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[101] bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.2 } }} onClick={onClose}
        >
            <motion.div
                className={`relative w-full max-w-3xl bg-slate-50 dark:bg-slate-800 rounded-xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden`}
                initial={{ y: 50, scale: 0.95, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }}
                exit={{ y: 30, scale: 0.95, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-5 sm:p-6 bg-blue-600 dark:bg-blue-700 text-white flex-shrink-0">
                    <div className="flex items-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full bg-white/20">
                            <History className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                                Case Progress Timeline
                            </h2>
                            {caseNumber && <p className="text-xs sm:text-sm opacity-80">For Case: {caseNumber}</p>}
                        </div>
                    </div>
                    <button
                        title="Close modal"
                        className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <main className="flex-grow p-5 sm:p-6 overflow-y-auto styled-scrollbar bg-white dark:bg-slate-800">
                    {isLoading && <div><ProgressItemSkeleton /><ProgressItemSkeleton /></div>}
                    {isError && <div className="text-center text-red-500 py-10 font-bold">Failed to load progress records.</div>}
                    {!isLoading && !isError && (
                        progressRecords?.length === 0 && !isAdding ? (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                <MessageSquareText className="w-12 h-12 mx-auto mb-3 opacity-70" />
                                <p className="font-bold">No progress has been recorded yet.</p>
                            </div>
                        ) : (
                            <div className="flow-root">
                                {progressRecords?.map((item: CaseProgressData) => (
                                    <ProgressItem
                                        key={item.progress_id} item={item} isReadOnly={isReadOnly}
                                        isBusy={isBusy && editingProgressId !== item.progress_id}
                                        isEditing={editingProgressId === item.progress_id}
                                        isUpdating={isUpdating && editingProgressId === item.progress_id}
                                        onStartEdit={handleStartEdit} onCancelEdit={handleCancelEdit} onSaveEdit={handleSaveEdit} onDelete={handleDelete}
                                        editTitle={editTitle} setEditTitle={setEditTitle} editDetails={editDetails} setEditDetails={setEditDetails}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </main>

                {!isReadOnly && (
                    <footer className="flex-shrink-0 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <AnimatePresence>
                        {isAdding ? (
                            <motion.form
                                key="add-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleCreate} className="space-y-4"
                            >
                                <input
                                    value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g., Attended court hearing" required
                                    className="w-full px-3 py-2 font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 dark:text-white"
                                />
                                <textarea
                                    value={newDetails} onChange={(e) => setNewDetails(e.target.value)} rows={2} placeholder="Add details (Optional)"
                                    className="w-full px-3 py-2 font-medium bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 dark:text-white"
                                />
                                <div className="flex items-center justify-end space-x-3">
                                    <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-slate-700 bg-white dark:bg-slate-600 dark:text-slate-200 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isCreating} className="inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
                                        {isCreating ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Progress
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.button
                                key="add-button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(true)} disabled={isBusy}
                                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-extrabold text-white bg-blue-600 border border-transparent rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Add New Progress Record
                            </motion.button>
                        )}
                        </AnimatePresence>
                    </footer>
                )}
            </motion.div>
        </motion.div>
    );
};