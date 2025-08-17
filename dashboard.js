        // Sample data
        let investments = [
            { symbol: 'NASDAQ:AAPL', allocation: 40, name: 'Apple Inc.' },
            { symbol: 'NASDAQ:GOOGL', allocation: 25, name: 'Alphabet Inc.' },
            { symbol: 'COINBASE:BTCUSD', allocation: 20, name: 'Bitcoin' },
            { symbol: 'COINBASE:ETHUSD', allocation: 15, name: 'Ethereum' }
        ];

        const container = document.getElementById('container');

        function addInvestment() {
            const name = document.getElementById('name').value.trim();
            const symbol = document.getElementById('symbol').value.trim();
            const allocation = parseFloat(document.getElementById('allocation').value);

            if (name && symbol && !isNaN(allocation)) {
                const existing = investments.find(inv => inv.symbol === symbol);
                if (existing) {
                    existing.allocation = allocation;
                    existing.name = name;
                } else {
                    investments.push({ name, symbol, allocation });
                }
                document.getElementById('name').value = '';
                document.getElementById('symbol').value = '';
                document.getElementById('allocation').value = '';
                renderDashboard();
            } else {
                alert('Please input all fields.');
            }
        }

        function renderDashboard() {
            const topNValue = document.getElementById('topN').value;

            let sorted = [...investments].sort((a, b) => b.allocation - a.allocation);

            if (topNValue !== 'all') {
                sorted = sorted.slice(0, parseInt(topNValue));
            }

            container.innerHTML = '';

            sorted.forEach((inv, index) => {
                let row = document.createElement('div');
                row.className = 'row';

                let allocDiv = document.createElement('div');
                allocDiv.className = 'allocation';
                allocDiv.innerHTML = `${inv.name} (${inv.symbol}): <br>`;

                let input = document.createElement('input');
                input.type = 'number';
                input.value = inv.allocation;
                input.onchange = function() {
                    let newAlloc = parseFloat(this.value);
                    if (!isNaN(newAlloc)) {
                        const original = investments.find(i => i.symbol === inv.symbol);
                        if (original) {
                            original.allocation = newAlloc;
                        }
                    }
                };
                allocDiv.appendChild(input);

                let percentSpan = document.createElement('span');
                percentSpan.innerHTML = '%';
                allocDiv.appendChild(percentSpan);

                let chartDiv = document.createElement('div');
                chartDiv.className = 'chart';

                let widgetContainer = document.createElement('div');
                widgetContainer.className = 'tradingview-widget-container';

                let widgetId = `tradingview_${index}`;
                let innerDiv = document.createElement('div');
                innerDiv.id = widgetId;
                innerDiv.style.height = '100%';

                widgetContainer.appendChild(innerDiv);

                let copyrightDiv = document.createElement('div');
                copyrightDiv.className = 'tradingview-widget-copyright';
                copyrightDiv.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';
                widgetContainer.appendChild(copyrightDiv);

                chartDiv.appendChild(widgetContainer);

                row.appendChild(allocDiv);
                row.appendChild(chartDiv);

                container.appendChild(row);

                new TradingView.widget({
                    "container_id": widgetId,
                    "width": "100%",
                    "height": 300,
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "light",
                    "style": "1",
                    "symbol": inv.symbol,
                    "locale": "en",
                    "popup_width": "1000",
                    "popup_height": "650",
                    "toolbar_bg": "#f1f3f9",
                    "enable_publishing": false,
                    "allow_symbol_change": false,
                    "studies": [],
                    "show_popup_button": true,
                });
            });
        }

        renderDashboard();