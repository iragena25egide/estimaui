import React, { useEffect, useState } from "react";
import { X, Ruler, Loader2 } from "lucide-react";
import DimensionSheetService from "@/services/dimensionSheetService"; // adjust path

interface DimensionSheetModalProps {
  drawingId: string;
  open: boolean;
  onClose: () => void;
}

const DimensionSheetModal: React.FC<DimensionSheetModalProps> = ({
  drawingId,
  open,
  onClose,
}) => {
  const [sheets, setSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && drawingId) {
      loadSheets();
    }
  }, [open, drawingId]);

  const loadSheets = async () => {
    setLoading(true);
    try {
      // Make sure your service has this method (see below)
      const data = await DimensionSheetService.getByDrawing(drawingId);
      setSheets(data);
    } catch (error) {
      console.error("Failed to load dimension sheets", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Ruler className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-800">
              Dimension Sheets
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : sheets.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No dimension sheets found for this drawing.
            </div>
          ) : (
            <div className="grid gap-4">
              {sheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        Description
                      </p>
                      <p className="font-medium">{sheet.description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Dimensions (L×W×H)</p>
                      <p className="font-medium">
                        {sheet.length} × {sheet.width} × {sheet.height}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Quantity</p>
                      <p className="font-medium">{sheet.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Rate</p>
                      <p className="font-medium">₹{sheet.rate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="font-bold text-blue-600">₹{sheet.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DimensionSheetModal;