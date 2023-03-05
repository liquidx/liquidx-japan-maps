Svelte based project for rendering maps.

# Data Sources

- Railway Data [国土数値情報ダウンロードサービス](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-v3_0.html)
- Green Data [森林地域](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A13-v3_2.html)
- Tokyo data [](https://catalog.data.metro.tokyo.lg.jp/dataset?organization=t000010)
- Flooding data [](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A31-v3_0.html)

# Structure

```
/static/data/*.geojson - Preprocessed data sources.
```

# Setup

```
gsutil rsync gs://liquidx-maps/japan-data static/japan-data
gsutil rsync static/japan-data gs://liquidx-maps/japan-data
```
