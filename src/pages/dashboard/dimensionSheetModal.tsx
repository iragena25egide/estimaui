import React, { useEffect, useState } from "react";
import { X, Ruler, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import DimensionSheetService from "@/services/dimensionSheetService";

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
      const data = await DimensionSheetService.getByDrawing(drawingId);
      setSheets(data);
    } catch (error) {
      console.error("Failed to load dimension sheets", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl p-0 gap-0 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 border-b border-gray-200 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ruler className="w-6 h-6 text-blue-600" />
            Dimension Sheets
          </DialogTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : sheets.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No dimension sheets found for this drawing.
            </div>
          ) : (
            <div className="grid gap-4">
              {sheets.map((sheet) => (
                <Card key={sheet.id} className="border-gray-200 shadow-sm rounded-xl">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Description
                        </p>
                        <p className="font-medium text-gray-900">{sheet.description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Code
                        </p>
                        <p className="font-medium text-gray-900">{sheet.code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Dimensions (L×W×H)
                        </p>
                        <p className="font-medium text-gray-900">
                          {sheet.length} × {sheet.width} × {sheet.height}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Unit
                        </p>
                        <p className="font-medium text-gray-900">{sheet.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Quantity
                        </p>
                        <p className="font-medium text-gray-900">{sheet.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Rate
                        </p>
                        <p className="font-medium text-gray-900">
                          {Number(sheet.rate).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Total
                        </p>
                        <p className="font-bold text-blue-600">
                          {Number(sheet.total).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-2xl">
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DimensionSheetModal;