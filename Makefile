.PHONY: new

# 创建新博客文章
# 用法: make new title="文章标题" [tags="标签1,标签2"] [description="文章描述"] [draft=true]
new:
	@if [ -z "$(title)" ]; then \
		echo "❌ 请指定文章标题: make new title=\"文章标题\""; \
		exit 1; \
	fi; \
	slug=$$(echo "$(title)" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-zA-Z0-9\u4e00-\u9fff]/-/g; s/--*/-/g; s/^-//; s/-$$//'); \
	if [ -z "$$slug" ]; then \
		slug=$$(date +%Y%m%d%H%M%S); \
	fi; \
	dir="src/data/blog/_2026"; \
	filepath="$$dir/$$slug.md"; \
	mkdir -p "$$dir"; \
	if [ -f "$$filepath" ]; then \
		echo "❌ 文件已存在: $$filepath"; \
		exit 1; \
	fi; \
	datetime=$$(date -u +"%Y-%m-%dT%H:%M:%S+08:00"); \
	desc="$(description)"; \
	if [ -z "$$desc" ]; then desc="$(title)"; fi; \
	draft_val="$(draft)"; \
	if [ -z "$$draft_val" ]; then draft_val="false"; fi; \
	tags_val="$(tags)"; \
	if [ -z "$$tags_val" ]; then tags_val="随笔"; fi; \
	tags_yaml=""; \
	IFS=',' ; for tag in $$tags_val; do \
		tag=$$(echo "$$tag" | sed 's/^[[:space:]]*//;s/[[:space:]]*$$//'); \
		tags_yaml="$$tags_yaml\n  - $$tag"; \
	done; \
	printf -- "---\nauthor: koukyo\npubDatetime: %s\ntitle: %s\nfeatured: false\ndraft: %s\ntags:%b\ndescription: %s\n---\n\n## \n\n" \
		"$$datetime" "$(title)" "$$draft_val" "$$tags_yaml" "$$desc" > "$$filepath"; \
	echo "✅ 新文章已创建: $$filepath"; \
	echo "📝 标题: $(title)"; \
	echo "🏷️  标签: $$tags_val"
