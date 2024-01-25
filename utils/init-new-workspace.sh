#!/bin/bash
source ~/.bashkitrc && use_bashkit 9 || exit 255
REPO_DIR="$(git_root_dir)"

if [[ -z "$REPO_DIR" ]]; then
  cerr "Must be executed within a Git repository"
  quit 1
fi

if ! type gh &>/dev/null; then
  cerr "Please install the GitHub CLI: https://cli.github.com/manual/installation"
  quit 1
fi

GITHUB_REPO_URL="$(gh repo view --json url -q ".url")"; [ $? -ne 0 ] && quit 1
GITHUB_REPO_NAME="$(gh repo view --json name -q ".name")"; [ $? -ne 0 ] && quit 1

templated_files=(
  sonar-project.properties
  README.md
  package.json
)

extra_steps=()

types=("app" "module" "subgraph" "adapter" "tool" "scratch" "scratch-app")
choice="$(ask_choice_multiline "Layout" "${types[@]}")"
LAYOUT="${types[$((choice-1))]}"
PACKAGE_SCOPE="@agilysys-stay"

case "$LAYOUT" in
  app)
    skel_dir="new-app"
    WORKGROUP="apps"
    templated_files+=(.env.itest)
    ;;
  subgraph)
    skel_dir="new-subgraph"
    WORKGROUP="apps"
    extra_steps+=("subgraph")
    ;;
  adapter)
    skel_dir="new-adapter"
    WORKGROUP="apps"
    ADAPTER_ID="$(prompt "Adapter ID: ")"
    export ADAPTER_ID
    templated_files+=(adapter.yml .env.itest)
    extra_steps+=("adapter")
    ;;
  module)
    skel_dir="new-module"
    WORKGROUP="modules"
    ;;
  tool)
    skel_dir="new-tool"
    WORKGROUP="tools"
    ;;
  scratch)
    skel_dir="new-tool"
    WORKGROUP="scratches"
    PACKAGE_SCOPE="@agilysys-scratch"
    ;;
  scratch-app)
    skel_dir="new-app"
    WORKGROUP="scratches"
    PACKAGE_SCOPE="@agilysys-scratch"
    ;;
  *)
    cerr "Unsupported layout: $LAYOUT"
    exit 1
    ;;
esac

src_dir="$(realpath_of "${SCRIPT_DIR}/../skel/${skel_dir}")"
if ! [[ -d "$src_dir" ]]; then
  cerr "Skeleton directory does not exist: $src_dir"
  quit 1
fi

MODULE_NAME="$(prompt "Name: $PACKAGE_SCOPE/")"
PACKAGE_DESCRIPTION="$(prompt "Description: ")"
PACKAGE_NAME="$PACKAGE_SCOPE/${MODULE_NAME}"

export MODULE_NAME
export PACKAGE_DESCRIPTION
export PACKAGE_NAME
export PACKAGE_SCOPE
export WORKGROUP
export GITHUB_REPO_URL
export GITHUB_REPO_NAME

workgroup_dir="$(realpath_of "${REPO_DIR}/${WORKGROUP}")"
new_dir="${workgroup_dir}/${MODULE_NAME}"

set -e

step_create() {
  if ! [[ -d "$workgroup_dir" ]]; then
    if ask_yn "Create workgroup directory: $workgroup_dir?"; then
      mkdir -p "$workgroup_dir"
    else
      quit 1
    fi
  fi

  if [[ -d "$new_dir" ]]; then
    cerr "Directory exists: $new_dir"
    if ask_yn "Replace existing $new_dir"; then
      rm -rf "$new_dir"
    else
      quit 1
    fi
  fi

  cinfo "Creating: $new_dir"
  rsync -a "$src_dir/" "$new_dir/"

  for f in "${templated_files[@]}"; do
    if [ -f "$src_dir/$f" ]; then
      cinfo "Populating: $new_dir/$f"
      envsubst > "$new_dir/$f" < "$src_dir/$f"
    fi
  done
}

step_assimilate() {
  (
    cd $REPO_DIR
    npm i
  )
}

step_deps() {
  (
    cinfo "Installing linked module: @agilysys-stay/tsconfig"
    cd "$new_dir"
    npm i -D @agilysys-stay/tsconfig
  )
}

extra_step_subgraph() {
  local deps=(
    '@agilysys-stay/subgraph-starter'
  )
  (
    cd "$new_dir"
    for dep in "${deps[@]}"; do
      cinfo "Installing: $dep"
      npm i "$dep"
    done
  )

  cwarn "* Update .graphqlconfig"
}

extra_step_adapter() {
  local deps=(
    '@agilysys-stay/adapter-starter'
  )
  (
    cd "$new_dir"
    for dep in "${deps[@]}"; do
      cinfo "Installing: $dep"
      npm i "$dep"
    done
  )

  cwarn "* Update adapter.yml"
}

extra_step_wip_deps_dev() {
  local deps_dev=(
    "@agilysys-stay/tsconfig"
    "@types/chai"
    "@types/lodash"
    "@types/mocha"
    "@types/node"
    "@types/sinon"
    "c8"
    "chai"
    "import-meta-resolve"
    "mocha"
    "rimraf"
    "sinon"
    "source-map-support"
    "ts-node"
    "typescript"
  )
  cd $REPO_DIR
  npm install --save-dev --package-lock-only --no-package-lock --workspace "$PACKAGE_NAME" "${deps_dev[@]}"
}

for step in "create" "assimilate" "deps"; do
  cunderline "$step"
  step_$step
done

for step in "${extra_steps[@]}"; do
  cunderline "$step"
  extra_step_$step
done

if [ -f "$new_dir/sonar-project.properties" ]; then
  cwarn "
Add project to SonarQube: https://sonar.hospitalityrevolution.com/projects/create?mode=manual"
fi
