type Product = { id: string; name: string; stock: number; category: string };
type Sale = { id: string; totalAmount: number; paymentType: string; createdAt: Date | string };

type Props = {
  totalRevenue: number;
  totalPurchaseSpend: number;
  netFigure: number;
  startOfMonth: string;
  lowStockProducts: Product[];
  recentSales: Sale[];
  currency: string;
};

export function ReportsDashboard({
  totalRevenue,
  totalPurchaseSpend,
  netFigure,
  startOfMonth,
  lowStockProducts,
  recentSales,
  currency,
}: Props) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Accounting Reports & Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-brand">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Monthly Revenue
          </h2>
          <p className="text-3xl font-bold text-gray-900">
            {currency} {totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-2">Since {startOfMonth}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-red-500">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Monthly Spend (Received)
          </h2>
          <p className="text-3xl font-bold text-gray-900">
            {currency} {totalPurchaseSpend.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-2">Since {startOfMonth}</p>
        </div>
        <div
          className={`bg-white shadow rounded-lg p-6 border-l-4 ${netFigure >= 0 ? "border-green-500" : "border-red-500"}`}
        >
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Net Figure
          </h2>
          <p className={`text-3xl font-bold ${netFigure >= 0 ? "text-green-600" : "text-red-600"}`}>
            {currency} {netFigure.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-2">Revenue − Spend</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Low Stock Alerts</h3>
            <p className="text-sm text-gray-500">Products with less than 10 items in stock</p>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-500">Product</th>
                <th className="p-4 font-medium text-gray-500">Category</th>
                <th className="p-4 font-medium text-gray-500 text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    All stock levels are healthy!
                  </td>
                </tr>
              ) : (
                lowStockProducts.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{p.name}</td>
                    <td className="p-4 text-gray-500">{p.category}</td>
                    <td className="p-4 text-right">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        {p.stock}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Sales */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Recent Sales</h3>
            <p className="text-sm text-gray-500">Last 10 completed transactions</p>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-500">Date</th>
                <th className="p-4 font-medium text-gray-500">Payment</th>
                <th className="p-4 font-medium text-gray-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No sales recorded yet.
                  </td>
                </tr>
              ) : (
                recentSales.map(sale => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-500">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 capitalize text-gray-700">{sale.paymentType}</td>
                    <td className="p-4 text-right font-medium text-gray-900">
                      {currency}{sale.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
