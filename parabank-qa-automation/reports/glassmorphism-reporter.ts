import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';


class CustomReporter implements Reporter {

  private totalTests = 0;
  private passedTests = 0;
  private failedTests = 0;
  private skippedTests = 0;
  private testDetails: Array<{ name: string; status: string; duration: number; error?: string }> = [];

  onBegin(config: FullConfig) {
    console.log('✨ Custom Glassmorphism Reporter Started');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.totalTests++;

    if (result.status === 'passed') {
      this.passedTests++;
    }
    if (result.status === 'failed') {
      this.failedTests++;
    }
    if (result.status === 'skipped') {
      this.skippedTests++;
    }

    
    this.testDetails.push({
      name: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
    });
  }

  async onEnd(result: FullResult) {
    
    console.log('');
    console.log('==============================');
    console.log('       CUSTOM TEST REPORT');
    console.log('==============================');
    console.log(`Total Tests   : ${this.totalTests}`);
    console.log(`Passed Tests  : ${this.passedTests}`);
    console.log(`Failed Tests  : ${this.failedTests}`);
    console.log(`Skipped Tests : ${this.skippedTests}`);
    console.log(`Final Status  : ${result.status}`);
    console.log('==============================');

    
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Glassmorphism QA Dashboard</title>
      <style>
        body {
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: #f8fafc;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        h1 {
          color: #F48031; /* Assigned Hex Code */
          border-bottom: 2px solid #F48031;
          padding-bottom: 10px;
          width: 80%;
          text-align: center;
        }
        .dashboard {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 30px;
          width: 80%;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .summary-cards {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          flex: 1;
          margin: 0 10px;
          text-align: center;
        }
        .card.passed h3 { color: #F48031; } /* Passing Indicator Hex */
        .card.failed h3 { color: #ef4444; }
        .test-item {
          background: rgba(255, 255, 255, 0.02);
          border-left: 5px solid #F48031;
          margin: 10px 0;
          padding: 15px;
          border-radius: 4px;
        }
        .test-item.failed { border-left-color: #ef4444; }
        .error { color: #f87171; font-size: 0.9em; margin-top: 5px; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <h1>ParaBank Test Summary Dashboard</h1>
      <div class="dashboard">
        <div class="summary-cards">
          <div class="card"><h3>Total Tests</h3><p>${this.totalTests}</p></div>
          <div class="card passed"><h3>Passed</h3><p>${this.passedTests}</p></div>
          <div class="card failed"><h3>Failed</h3><p>${this.failedTests}</p></div>
        </div>
        <h2>Test Details</h2>
        ${this.testDetails.map(r => `
          <div class="test-item ${r.status === 'failed' ? 'failed' : ''}">
            <strong>${r.name}</strong> - <span>${r.status.toUpperCase()}</span> (${(r.duration / 1000).toFixed(2)}s)
            ${r.error ? `<div class="error">${r.error}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </body>
    </html>
    `;

    const reportPath = path.join(process.cwd(), 'custom-report.html');


    fs.writeFileSync(reportPath, htmlContent, 'utf-8');
    console.log(`\n✨ Glassmorphism Report Generated successfully at: ${reportPath}`);
  }
}

export default CustomReporter;