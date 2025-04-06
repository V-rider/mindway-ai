
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportTemplate } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ReportGeneratorProps {
  templates: ReportTemplate[];
  selectedIds?: string[];
  type: 'student' | 'class' | 'school';
  onClose: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  templates,
  selectedIds = [],
  type,
  onClose,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    templates.length > 0 ? templates[0].id : null
  );
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');
  
  const handleGenerateReport = () => {
    // In a real app, this would call an API to generate the report
    toast.success(`Report generation started. It will be emailed when ready.`);
    onClose();
  };
  
  const handleAddRecipient = () => {
    if (newRecipient && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    } else {
      toast.error('Please enter a valid email address');
    }
  };
  
  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Generate Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div>
            <Label className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3 block">
              Report Template
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedTemplate === template.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {template.type.charAt(0).toUpperCase() + template.type.slice(1)} report • {template.frequency}
                      </p>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Date Range */}
          <div>
            <Label className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3 block">
              Date Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date" className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Format */}
          <div>
            <Label className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3 block">
              File Format
            </Label>
            <div className="flex gap-4">
              <div
                className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer ${
                  format === 'pdf'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setFormat('pdf')}
              >
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
                  {format === 'pdf' && (
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  )}
                </div>
                <span className="text-gray-800 dark:text-gray-200">PDF</span>
              </div>
              <div
                className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer ${
                  format === 'csv'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setFormat('csv')}
              >
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
                  {format === 'csv' && (
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  )}
                </div>
                <span className="text-gray-800 dark:text-gray-200">CSV</span>
              </div>
            </div>
          </div>
          
          {/* Email Recipients */}
          <div>
            <Label className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3 block">
              Email Report To (Optional)
            </Label>
            <div className="flex mb-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                className="rounded-r-none"
              />
              <Button 
                onClick={handleAddRecipient} 
                className="rounded-l-none"
              >
                Add
              </Button>
            </div>
            {recipients.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {recipients.map((email) => (
                  <div 
                    key={email}
                    className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm flex items-center gap-1"
                  >
                    <span className="text-gray-800 dark:text-gray-200">{email}</span>
                    <button
                      onClick={() => handleRemoveRecipient(email)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateReport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
