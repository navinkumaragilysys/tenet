#!/bin/bash
# Copyright (C) Agilysys, Inc. All rights reserved.

source ~/.bashkitrc || exit 255

bak_extenstion=".install.bak"
install_backups_dir=".bak"
backplane_base_dir="../../../backplane-base"
opt_action=

function usage {
  name=$(basename $0)
  cat <<__end
usage:
  $name -?|--help
  $name [options] action
actions:
  link
  relink
options
  -d|--base-dir <dir>       Path (relative to node_modules/@agilysys-stay) to the
                            stay-backplane-base repository. (Default: $backplane_base_dir)
__end
}

_main () {
  if [[ $# -eq 0 ]]; then
    cerr "No action provided (see --help)"
    return 1
  fi
  while [[ $# -gt 0 ]]; do
    local arg="$1"; shift
    case "$arg" in
      -\?|--help)
        usage
        exit 0
        ;;
      -d|--base-dir)
        backplane_base_dir="$1"
        shift
        ;;
      link) 
        _npm_link "./node_modules/@agilysys-stay" "${backplane_base_dir}/modules"
        _npm_link "./node_modules/@agilysys-stay" "${backplane_base_dir}/starters"
        ;;
      relink) 
        _relink "./node_modules/@agilysys-stay"
        ;;
      -*)
        usage "Unknown option: $1"
        exit 1
        ;;
      *)
        usage "Unknown argument: $1"
        exit 1
        ;;
    esac
  done
}


_relink () {
  for dir in "$@"; do
    (
    cd "$dir"
    for item in ./*; do
      if [ -L "$item" ]; then
        link_target="$(ls -l "$item" | awk '{print $NF}')"
        if [ -d "$link_target" ]; then
          unlink "$item"
          ln -s "$link_target" "$item"
          ls -l "$item"
        fi
      fi
    done
    )
  done
}

_npm_link () {
  local modules_dir="$1"; shift
  local sources_dir="$1"; shift

  if ! [ -d "$modules_dir" ]; then
    cerr "Not a directory: $modules_dir (pwd=$(pwd))"
    return 1
  fi

  (
    cd $modules_dir

    if ! [ -d "$sources_dir" ]; then
      cerr "Not a directory: $sources_dir (pwd=$(pwd))"
      return 1
    fi

    dirs=(*)

    for dir in "${dirs[@]}"; do
      if [[ "$dir" == *$bak_extenstion ]]; then
        continue
      fi
      if ! [ -L "$dir" ]; then
        if [ -d "$dir" ]; then
          local dir_name="$(basename "$dir")"
          local package_json="$sources_dir/$dir_name/package.json"
          # cverb "Looking at link: $dir ($dir_name) -> $package_json"

          if [ -f "$package_json" ]; then
            local scoped_name="$(jq -r '.name' "$package_json")"
            local name="${scoped_name/@agilysys-stay\/}"
            if [ "$name" == "$dir_name" ]; then
              rm -rf "$dir"
              ln -s "$sources_dir/$dir_name" "$dir"
              cinfo "Linked: $dir -> $sources_dir/$dir_name"
            else
              cerr "Module directory does not match its name (module=$name vs dir=$dir_name)"
            fi
          fi
        fi
      else
        local link_target="$(ls -l "$dir" | awk '{print $NF}')"
        if [[ "$link_target" == "$sources_dir"/* ]]; then
          cinfo "Linked: $dir -> $link_target"
        fi
      fi
    done
  )
}

_main "$@"
