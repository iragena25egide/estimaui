import React, { useEffect, useState } from "react";
import { X, Ruler, Loader2, Plus, Edit2, Trash2, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DimensionSheetService from "@/services/dimensionSheetService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

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
  const { isViewer } = useAuth();
  const [sheets, setSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    unit: "m³",
    rate: "",
    length: "",
    width: "",
    height: "",
    formula: "",
  });

  useEffect(() => {
    if (open && drawingId) {
      loadSheets();
      resetForm();
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

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      code: "",
      description: "",
      unit: "m³",
      rate: "",
      length: "",
      width: "",
      height: "",
      formula: "",
    });
  };

  const getPreviewQuantity = () => {
    const rate = parseFloat(formData.rate) || 0;
    const L = parseFloat(formData.length) || 0;
    const W = parseFloat(formData.width) || 0;
    const H = parseFloat(formData.height) || 0;

    if (formData.formula) {
      try {
        // Replace L, W, H variables safely (case-insensitive)
        let cleanFormula = formData.formula
          .replace(/\b(L|length)\b/gi, L.toString())
          .replace(/\b(W|width)\b/gi, W.toString())
          .replace(/\b(H|height)\b/gi, H.toString());

        // Safe mathematical evaluation loop
        const result = Function(`"use strict"; return (${cleanFormula})`)();
        if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
          return { quantity: result, total: result * rate, valid: true };
        }
      } catch (e) {
        return { quantity: 0, total: 0, valid: false };
      }
    } else {
      if (formData.length && formData.width && formData.height) {
        const result = L * W * H;
        return { quantity: result, total: result * rate, valid: true };
      }
    }
    return { quantity: 0, total: 0, valid: true };
  };

  const preview = getPreviewQuantity();

  const handleSave = async () => {
    if (!formData.code || !formData.description || !formData.unit || !formData.rate) {
      toast.warning("Please fill in Code, Description, Unit, and Rate");
      return;
    }

    const payload = {
      drawingId,
      code: formData.code,
      description: formData.description,
      unit: formData.unit,
      rate: parseFloat(formData.rate) || 0,
      length: formData.length ? parseFloat(formData.length) : null,
      width: formData.width ? parseFloat(formData.width) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      formula: formData.formula || null,
    };

    try {
      if (editingId) {
        await DimensionSheetService.update(editingId, payload);
        toast.success("Dimension sheet updated");
      } else {
        await DimensionSheetService.create(payload);
        toast.success("Dimension sheet created");
      }
      resetForm();
      loadSheets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save entry");
    }
  };

  const handleEdit = (sheet: any) => {
    setEditingId(sheet.id);
    setFormData({
      code: sheet.code || "",
      description: sheet.description || "",
      unit: sheet.unit || "m³",
      rate: sheet.rate?.toString() || "",
      length: sheet.length?.toString() || "",
      width: sheet.width?.toString() || "",
      height: sheet.height?.toString() || "",
      formula: sheet.formula || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this dimension sheet?")) return;
    try {
      await DimensionSheetService.delete(id);
      toast.success("Dimension sheet deleted");
      loadSheets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete dimension sheet");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl p-0 gap-0 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 border-b border-gray-200 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ruler className="w-6 h-6 text-blue-600" />
            Dimension Sheets Take-off
          </DialogTitle>
          <div className="flex items-center gap-3">
            {!isViewer && !showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-sm font-medium flex items-center gap-1.5 px-4 py-2"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Dynamic Collapsible Input Form */}
          {showForm && !isViewer && (
            <Card className="border border-blue-100 bg-blue-50/20 shadow-sm rounded-2xl overflow-hidden animate-in fade-in duration-200">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-1.5 text-sm">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    {editingId ? "Edit Dimension Entry" : "New Take-off Entry"}
                  </h4>
                  <button
                    onClick={resetForm}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Code *</Label>
                    <Input
                      placeholder="e.g. CONC-01"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="bg-white rounded-lg border-gray-200"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Description *</Label>
                    <Input
                      placeholder="Reinforced Concrete Slab"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white rounded-lg border-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Unit *</Label>
                    <Input
                      placeholder="e.g. m³, m²"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="bg-white rounded-lg border-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Length (L)</Label>
                    <Input
                      type="number"
                      placeholder="L value"
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                      className="bg-white rounded-lg border-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Width (W)</Label>
                    <Input
                      type="number"
                      placeholder="W value"
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                      className="bg-white rounded-lg border-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Height (H)</Label>
                    <Input
                      type="number"
                      placeholder="H value"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="bg-white rounded-lg border-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Unit Rate ($) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 150"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      className="bg-white rounded-lg border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    Custom Calculation Formula
                    <span className="text-[10px] text-gray-400 font-normal normal-case italic">(Optional - supports vars L, W, H. e.g. 2 * (L + W) * H)</span>
                  </Label>
                  <Input
                    placeholder="Enter formula string (e.g. 2 * (L + W) * H)"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                    className="bg-white rounded-lg border-gray-200 font-mono text-sm"
                  />
                </div>

                {/* Interactive Dynamic Quantities Preview */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-blue-600 rounded-xl text-white gap-3 shadow-inner">
                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-200 block">Live Valuation Preview</span>
                    <div className="flex items-baseline gap-2">
                      {!preview.valid ? (
                        <span className="text-sm font-semibold text-red-200">Formula Parsing Error...</span>
                      ) : (
                        <>
                          <span className="text-lg font-bold">
                            {preview.quantity.toLocaleString(undefined, { maximumFractionDigits: 3 })} {formData.unit}
                          </span>
                          <span className="text-xs text-blue-200">
                            @ ${parseFloat(formData.rate || "0").toLocaleString()} / unit
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {preview.valid && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-200 block">Estimated Cost</span>
                      <span className="text-xl font-extrabold">${preview.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-gray-200 bg-white rounded-lg text-gray-600 text-xs px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!preview.valid}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs px-4 py-2 flex items-center gap-1 shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : sheets.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No dimension sheets found for this drawing. {!isViewer && "Click 'Add Entry' to create one."}
            </div>
          ) : (
            <div className="grid gap-4">
              {sheets.map((sheet) => (
                <Card key={sheet.id} className="border-gray-200 shadow-sm rounded-xl relative hover:border-blue-200 transition-colors">
                  <CardContent className="p-5">
                    {/* Mutating Action Buttons */}
                    {!isViewer && (
                      <div className="absolute right-4 top-4 flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(sheet)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sheet.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pr-16">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Code</p>
                        <p className="font-bold text-gray-900">{sheet.code}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Description</p>
                        <p className="font-medium text-gray-700">{sheet.description}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Quantity</p>
                        <p className="font-bold text-gray-900">
                          {Number(sheet.quantity).toLocaleString(undefined, { maximumFractionDigits: 3 })} {sheet.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Dimensions (L×W×H)</p>
                        {sheet.length || sheet.width || sheet.height ? (
                          <p className="font-medium text-gray-700">
                            {sheet.length ?? "-"} × {sheet.width ?? "-"} × {sheet.height ?? "-"}
                          </p>
                        ) : (
                          <p className="font-medium text-gray-400 italic">No static dimensions</p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Unit Rate</p>
                        <p className="font-medium text-gray-700">${Number(sheet.rate).toLocaleString()}</p>
                      </div>
                      {sheet.formula && (
                        <div className="col-span-2">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Formula</p>
                          <p className="font-mono text-xs text-blue-600 bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded inline-block">
                            {sheet.formula}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total Cost</p>
                        <p className="font-extrabold text-blue-600 text-lg">${Number(sheet.total).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-2xl">
          <Button variant="outline" onClick={onClose} className="rounded-lg text-xs px-5 py-2">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DimensionSheetModal;