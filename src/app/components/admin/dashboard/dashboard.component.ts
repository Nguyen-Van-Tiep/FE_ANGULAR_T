import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/commons/dto/Product';
import { ProductDTO } from 'src/app/commons/dto/ProductDTO';
import { RevenueData } from 'src/app/commons/dto/RevenueData';
import { BillService } from 'src/app/service/bill/bill.service';
import { ProductService } from 'src/app/service/product/product.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  startDate: string = ''; // Khai báo biến startDate
  endDate: string = ''; // Khai báo biến endDate
  statistics: any = {};
  dailyStatistics: any = {};
  weeklyStatistics: any = {};
  monthlyStatistics: any = {};
  yearlyStatistics: any = {};
  showInitialChart: boolean = true;
  showFilteredChart: boolean = false;
  filteredChartOptions: any;
  filteredData: any[] = [];
  chartOptions: any;
  revenueChartOptions: any;
  revenueChartOptions2: any;
  revenueChartOptions3: any;
  response: Product = new Product();
  monthlyRevenueData: { label: string; y: number }[] = [];
  bestSellingProductsData: any;
  currentMonth!: number;
  filteredProducts: ProductDTO[] = [];
  productsDay: ProductDTO[] = [];
  productsWeek: ProductDTO[] = [];
  productsMonth: ProductDTO[] = [];
  productsYear: ProductDTO[] = [];
  constructor(
    private productService: ProductService,
    private billService: BillService
  ) {
    this.monthlyRevenueData = [];
    this.bestSellingProductsData = [];
  }

  ngOnInit(): void {
    const currentMonth = new Date().getMonth() + 1; // Adjust as needed
    this.loadMonthlyRevenue();
    this.loadBestSellingProducts(currentMonth);
    this.loadStatisticsByDay();
    this.loadStatisticsByWeek();
    this.loadStatisticsByMonth();
    this.loadStatisticsByYear();
    this.applyFilter2('month');
  }
  applyFilter(productName: string, month: number) {
    this.productService
      .getFilteredStatistics(productName, month)
      .subscribe((filteredData) => {
        this.filteredData = filteredData.map((item) => ({
          label: item.productName,
          y: item.totalSold,
        }));
        this.renderFilteredChart();
      });
  }
  renderFilteredChart() {
    this.showInitialChart = false;
    this.showFilteredChart = true;
    this.filteredChartOptions = {
      animationEnabled: true,
      title: { text: 'Sản Phẩm Sau Khi Lọc' },
      data: [{ type: 'column', dataPoints: this.filteredData }],
    };
  }
  loadMonthlyRevenue() {
    this.productService.getMonthlyRevenue().subscribe((data: RevenueData[]) => {
      console.log('Dữ liệu nhận được từ API:', data); // Kiểm tra định dạng dữ liệu

      if (Array.isArray(data) && data.length > 0) {
        this.monthlyRevenueData = data.map((item) => ({
          label: `Tháng ${item.month}`,
          y: item.totalAmount,
        }));
      } else {
        console.warn('Dữ liệu không đúng định dạng:', data);
      }

      // Cập nhật tùy chọn biểu đồ
      this.revenueChartOptions = {
        animationEnabled: true,
        theme: 'light2',
        title: {
          text: 'Doanh Thu Theo Tháng',
        },
        axisY: {
          title: 'Doanh Thu',
          prefix: '₫',
        },
        data: [
          {
            type: 'column',
            dataPoints: this.monthlyRevenueData,
          },
        ],
      };
    });
  }

  loadBestSellingProducts(currentMonth: number) {
    this.productService
      .getBestSellingProducts(currentMonth)
      .subscribe((data: Product[]) => {
        // Map the data to the format expected by the chart
        this.bestSellingProductsData = data.map((item) => ({
          label: item.productName,
          y: item.totalSold,
        }));
        console.log('Dữ liệu nhận được từ API:', data);
        // Set up chart options with the mapped data
        this.revenueChartOptions2 = {
          animationEnabled: true,
          theme: 'light2',
          title: {
            text: 'Sản phẩm bán chạy nhất',
          },
          axisX: {
            title: 'Sản phẩm',
          },
          axisY: {
            title: 'Số lượng bán ra',
          },
          data: [
            {
              type: 'pie',
              dataPoints: this.bestSellingProductsData,
            },
          ],
        };
      });
  }
  exportToExcel(currentMonth: number = new Date().getMonth() + 1) {
    console.log('currentMonth' + currentMonth);
    if (currentMonth > 0 && currentMonth <= 12) {
      this.productService
        .exportBestSellingProducts(currentMonth)
        .subscribe((response) => {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'best_selling_products.xlsx';
          anchor.click();
          window.URL.revokeObjectURL(url);
        });
    } else {
      console.error('Tháng không hợp lệ:', currentMonth);
    }
  }

  //-----------------------------------------//
  loadStatisticsByDay(): void {
    this.billService.getStatisticsByDay().subscribe((data) => {
      this.dailyStatistics = data;
    });
  }

  loadStatisticsByWeek(): void {
    this.billService.getStatisticsByWeek().subscribe((data) => {
      this.weeklyStatistics = data;
    });
  }

  loadStatisticsByMonth(): void {
    this.billService.getStatisticsByMonth().subscribe((data) => {
      this.monthlyStatistics = data;
    });
  }

  loadStatisticsByYear(): void {
    this.billService.getStatisticsByYear().subscribe((data) => {
      this.yearlyStatistics = data;
    });
  }

  applyFilter2(filterType: string) {
    const today = new Date();

    let startDate: string;
    let endDate: string;

    switch (filterType) {
      case 'day':
        startDate = today.toISOString().split('T')[0];
        endDate = new Date(today.setDate(today.getDate() + 1))
          .toISOString()
          .split('T')[0];
        this.productService
          .getTopSellingProductsByDay()
          .subscribe((data: ProductDTO[]) => {
            this.filteredProducts = data;
          });
        break;
      case 'week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Thứ Hai
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Chủ Nhật
        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = endOfWeek.toISOString().split('T')[0];
        this.productService
          .getTopSellingProductsByWeek(startDate, endDate)
          .subscribe((data: ProductDTO[]) => {
            this.filteredProducts = data;
          });
        break;
      case 'month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Ngày đầu tháng
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ); // Ngày cuối tháng
        startDate = startOfMonth.toISOString().split('T')[0];
        endDate = endOfMonth.toISOString().split('T')[0];
        this.productService
          .getTopSellingProductsByMonth()
          .subscribe((data: ProductDTO[]) => {
            this.filteredProducts = data;
          });
        break;
      case 'year':
        const startOfYear = new Date(today.getFullYear(), 0, 1); // Ngày đầu năm
        const endOfYear = new Date(today.getFullYear(), 11, 31); // Ngày cuối năm
        startDate = startOfYear.toISOString().split('T')[0];
        endDate = endOfYear.toISOString().split('T')[0];
        this.productService
          .getTopSellingProductsByYear()
          .subscribe((data: ProductDTO[]) => {
            this.filteredProducts = data;
          });
        break;
      case 'custom':
        if (this.startDate && this.endDate) {
          this.productService
            .getTopSellingProductsByCustomRange(this.startDate, this.endDate)
            .subscribe((data: ProductDTO[]) => {
              this.filteredProducts = data;
            });
        } else {
          alert('Hãy chọn cả ngày bắt đầu và ngày kết thúc.');
        }
        break;

      default:
        alert('Lựa chọn không hợp lệ!');
    }
  }
}
